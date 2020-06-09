using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly DataContext dataContext;

        public ValuesController(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        [HttpGet("getvalue")]
        public async Task<IActionResult> GetValues()
        {
            var values = await dataContext.Values.ToListAsync();

            return Ok(values);
        }

        [HttpGet("getvalue/{id}")]
        public async Task<IActionResult> GetValues(int Id)
        {

            var value = await dataContext.Values.FirstOrDefaultAsync(x => x.Id == Id);

            return Ok(value);
        }

    }
}