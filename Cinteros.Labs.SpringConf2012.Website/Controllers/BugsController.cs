using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web.Http;

namespace Cinteros.Labs.SpringConf2012.Website.Controllers {
    public class BugsController : ApiController {
        private static ObservableCollection<Bug> repository = new ObservableCollection<Bug>();
        static BugsController() {
            repository.Add(new Bug { Name = "Bug 1", Hours = 10, Priority = BugPriority.Normal, Description = string.Empty, });
            repository.Add(new Bug { Name = "Bug 2", Hours = 33, Priority = BugPriority.Low, Description = string.Empty, });
            repository.Add(new Bug { Name = "Bug 3", Hours = 20, Priority = BugPriority.High, Description = string.Empty, });
        }

        public IEnumerable<Bug> Get() {
            return repository;
        }

        public void Post(Bug bug) {
            repository.Add(bug);
        }

        public void Put(Bug bug) {
            var existingBug = repository.FirstOrDefault(x => x.ID == bug.ID);
            if(existingBug == null) {
                return;
            }

            int index = repository.IndexOf(existingBug);
            repository[index] = bug;
        }
    }
}
