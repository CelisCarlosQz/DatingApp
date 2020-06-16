using System.Collections.Generic;
using System.Threading.Tasks;
using Api.Models;

namespace Api.Data
{
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T: class; // T can be User or Photo...
        void Delete<T>(T entity) where T:class;
        Task<bool> SaveAll();
        Task<Users> GetUser(int id);
        Task<IEnumerable<Users>> GetUsers();
    }
}
