using System.Collections.Generic;
using System.Threading.Tasks;
using Api.Data;
using Api.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    // UsersListDTO - UserDetailDTO
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

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _datingRepository.GetUsers();

            var userstoReturn = _mapper.Map<IEnumerable<UsersListDTO>>(users); // <Destination>(Source)

            return Ok(userstoReturn);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _datingRepository.GetUser(id);

            var usertoReturn = _mapper.Map<UserDetailDTO>(user);

            return Ok(usertoReturn);
        }
    }
}