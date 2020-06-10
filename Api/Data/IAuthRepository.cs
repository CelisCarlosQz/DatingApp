using System.Threading.Tasks;
using Api.Models;

namespace Api.Data
{
    public interface IAuthRepository
    {
        Task<Users> Register(Users user, string password);

        Task<Users> Login(string username, string password);

        Task<bool> UserExist(string username);

    }
}