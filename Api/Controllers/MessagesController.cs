using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Api.Data;
using Api.DTOs;
using Api.Helpers;
using Api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [ApiController]
    [Route("users/{userId}/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _datingRepository;
        private readonly IMapper _mapper;
        public MessagesController(IDatingRepository datingRepository, IMapper mapper)
        {
            _mapper = mapper;
            _datingRepository = datingRepository;
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){ // Get Id From Token
                return Unauthorized();
            }

            var messageFromRepo = await _datingRepository.GetMessages(id);

            if(messageFromRepo == null){
                return NotFound();
            }

            return Ok(messageFromRepo);
        }

        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId, 
            [FromQuery] MessageParams messageParams)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){ // Get Id From Token
                return Unauthorized();
            }

            messageParams.UserId = userId;

            var messagesFromRepo = await _datingRepository.GetMessagesForUser(messageParams);

            var messages = _mapper.Map<IEnumerable<MessageToReturnDTO>>(messagesFromRepo);

            Response.AddPagination(messagesFromRepo.CurrentPage, messagesFromRepo.PageSize,
                messagesFromRepo.TotalCount, messagesFromRepo.TotalPages);

            return Ok(messages);

        }

        [HttpGet("thread/{recepientId}")]
        public async Task<IActionResult> GetMessageThread(int userId, int recepientId)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){ // Get Id From Token
                return Unauthorized();
            }

            var messagesFromRepo = await _datingRepository.GetMessageThread(userId, recepientId);
            var messageThread = _mapper.Map<IEnumerable<MessageToReturnDTO>>(messagesFromRepo);

            return Ok(messageThread);
        }

        [HttpPost] // Base Route
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreateDTO messageForCreate)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){ // Get Id From Token
                return Unauthorized();
            }

            messageForCreate.SenderId = userId;

            var recipient = await _datingRepository.GetUser(messageForCreate.RecipientId); // AutoMapper Sends This Data Auto...
            // Create So It Will Map Auto...
            var sender = await _datingRepository.GetUser(messageForCreate.SenderId);

            if(recipient == null){
                return BadRequest("No se encontró el usuario");
            }

            var message = _mapper.Map<Messages>(messageForCreate);

            _datingRepository.Add<Messages>(message);

            if(await _datingRepository.SaveAll()){
                var messagetoReturn = _mapper.Map<MessageToReturnDTO>(message);
                return CreatedAtRoute("GetMessage", new { id = message.Id }, messagetoReturn);
            }

            return BadRequest("Fallo en la actualización");

        }

        [HttpPost("{id}/read")]
        public async Task<IActionResult> Read(int id, int userId)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){ // Get Id From Token
                return Unauthorized();
            }

            var messageFromRepo = await _datingRepository.GetMessages(id);

            if(messageFromRepo.RecipientId != userId){
                return Unauthorized();
            }

            messageFromRepo.IsRead = true;
            messageFromRepo.DateRead = DateTime.Now;

            await _datingRepository.SaveAll();

            return NoContent();
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int id, int userId)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){ // Get Id From Token
                return Unauthorized();
            }

            var messageFromRepo = await _datingRepository.GetMessages(id);

            if(messageFromRepo.SenderId == userId){
                messageFromRepo.SenderDeleted = true;
            }

            if(messageFromRepo.RecipientId == userId){
                messageFromRepo.RecipientDeleted = true;
            }

            if(messageFromRepo.SenderDeleted && messageFromRepo.RecipientDeleted){
                _datingRepository.Delete<Messages>(messageFromRepo);
            }

            if(await _datingRepository.SaveAll()){
                return NoContent();
            }

            return BadRequest("Fallo en la eliminación");
        }
    }
}