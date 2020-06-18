using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Api.Data;
using Api.DTOs;
using Api.Helpers;
using Api.Models;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("users/{userId}")]
    public class PhotoController : ControllerBase
    {
        private readonly IDatingRepository _datingRepository;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinarySettings;

        public PhotoController(IDatingRepository datingRepository, IMapper mapper,
            IOptions<CloudinarySettings> cloudinarySettings)
        {
            _cloudinarySettings = cloudinarySettings;
            _mapper = mapper;
            _datingRepository = datingRepository;
        }

        [HttpGet("photos/{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _datingRepository.GetPhoto(id);
            var photoToReturn = _mapper.Map<PhotoToReturnDTO>(photoFromRepo);
            return Ok(photoToReturn);
        }

        [HttpPost("mainphoto/{photoId}")]
        public async Task<IActionResult> MainPhoto(int userId, int photoId)
        {

            if(userId != Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }

            var userFromRepo = await _datingRepository.GetUser(userId);

            if(!userFromRepo.Photos.Any(x => x.Id == photoId)){
                return Unauthorized();
            }

            var newmainPhoto = await _datingRepository.GetPhoto(photoId);
            if(newmainPhoto.IsMain){
                return BadRequest("Ya es la foto principal");
            }
            newmainPhoto.IsMain = true;

            var mainPhotoFromRepo = await _datingRepository.GetMainPhoto(userId);
            mainPhotoFromRepo.IsMain = false;

            if(await _datingRepository.SaveAll()){
                return NoContent();
            }

            return BadRequest("Fallo en la actualización");
        }

        [HttpPost("uploadphoto")]
        public async Task<IActionResult> UploadPhoto(int userId, [FromForm] PhotoForUploadDTO photoForUploadDTO)
        {

            // Check ID On Route To ID on Token
            if(userId != Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }

            var userFromRepo = await _datingRepository.GetUser(userId);

            Account credsAcc = new Account(_cloudinarySettings.Value.CloudName, _cloudinarySettings.Value.ApiKey,
                _cloudinarySettings.Value.ApiSecret);

            var filetoUpload = photoForUploadDTO.File;

            var cloudinaryClient = new Cloudinary(credsAcc);

            var cloudinaryResponse = new ImageUploadResult();

            if(filetoUpload.Length > 0){

                using(var photoStream = filetoUpload.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams(){
                        File = new FileDescription(filetoUpload.Name, photoStream),
                        Transformation = new Transformation().Width(500).Height(500).
                            Crop("fill").Gravity("face")
                    };
                    cloudinaryResponse = cloudinaryClient.Upload(uploadParams); // Stores Response From Cloudinary

                    photoForUploadDTO.Url = cloudinaryResponse.Url.ToString();
                    photoForUploadDTO.PublicId = cloudinaryResponse.PublicId;
                }

                var photoObj = _mapper.Map<Photos>(photoForUploadDTO); // Source - Destination

                if(!userFromRepo.Photos.Any(p => p.IsMain)){
                    // User Doesn't Have A Main Picture
                    photoObj.IsMain = true;
                }
                
                userFromRepo.Photos.Add(photoObj);

                if(await _datingRepository.SaveAll()){

                    var phototoReturn = _mapper.Map<PhotoToReturnDTO>(photoObj); // Doing It Here Will Ensure The Id

                    return CreatedAtRoute("GetPhoto", new { id = photoObj.Id }, phototoReturn); // It Return The Endpoint To Get The Photo
                }

                return BadRequest("No se pudo cargar foto/s");

            }
            return BadRequest("No hay foto");
        }

        [HttpDelete("deletephoto/{photoId}")]
        public async Task<IActionResult> DeletePhoto(int photoId, int userId)
        {
            if(userId != Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }

            var userFromRepo = await _datingRepository.GetUser(userId);

            if(!userFromRepo.Photos.Any(x => x.Id == photoId)){
                return Unauthorized();
            }

            var photoFromRepo = await _datingRepository.GetPhoto(photoId);
            if(photoFromRepo.IsMain){
                return BadRequest("No puedes borrar tu foto principal");
            }

            Account credsAcc = new Account(_cloudinarySettings.Value.CloudName, _cloudinarySettings.Value.ApiKey,
                _cloudinarySettings.Value.ApiSecret);

            var cloudinaryClient = new Cloudinary(credsAcc);

            var deleteParams = new DeletionParams(photoFromRepo.PublicId);
            var cloudinaryResponse = cloudinaryClient.Destroy(deleteParams);

            if(cloudinaryResponse.Result == "ok"){
                _datingRepository.Delete(photoFromRepo);
            }

            if(await _datingRepository.SaveAll()){
                return Ok();
            }

            return BadRequest("Fallo en la eliminación");
        }
    }
}
