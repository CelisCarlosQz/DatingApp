using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Api.Data;
using Api.DTOs;
using Api.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))] // -> Anytime These Methods Get Call - LogUserActivity Gets Called
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _datingRepository;
        private readonly IMapper _mapper;
        public UsersController(IDatingRepository datingRepository, IMapper mapper)
        {
            _mapper = mapper;
            _datingRepository = datingRepository;
        }

        [HttpGet] // -> Same As /, Get Values Needs To Be Passed On String pageNumber = &...
        public async Task<IActionResult> GetUsers([FromQuery] UserParams userParams)
        {

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userFromRepo = await _datingRepository.GetUser(currentUserId);

            userParams.UserId = currentUserId;
            if(string.IsNullOrEmpty(userParams.Gender)){ // When Gender Is Not Defined In UserParams
                userParams.Gender = userFromRepo.Gender == "male" ? "female": "male";
            }

            var users = await _datingRepository.GetUsers(userParams); // Page List OF Users

            var userstoReturn = _mapper.Map<IEnumerable<UsersListDTO>>(users); // <Destination>(Source)

            Response.AddPagination(users.CurrentPage, users.PageSize, 
                users.TotalCount, users.TotalPages); // My Header

            return Ok(userstoReturn);
        }

        [HttpGet("{id}", Name ="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _datingRepository.GetUser(id);

            var usertoReturn = _mapper.Map<UserDetailDTO>(user);

            return Ok(usertoReturn);
        }

        // .NET Core Maps User Atributtes To userForUpdateDTO - With AutoMapper
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDTO userForUpdateDTO)
        {
            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){ // Get Id From Token
                return Unauthorized();
            }

            var userFromRepo = await _datingRepository.GetUser(id);

            _mapper.Map(userForUpdateDTO, userFromRepo);

            if(await _datingRepository.SaveAll()){
                return NoContent();
            }

            return BadRequest("Fallo en la actualización");
        }
    }
}
