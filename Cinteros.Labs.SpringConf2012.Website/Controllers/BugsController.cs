using System;
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

        public Bug Post(Bug bug) {
            repository.Add(bug);
            return bug;
        }

        public void Put(Bug bug, int priorityIndex) {
            switch(priorityIndex) {
                case 0:
                    bug.Priority = BugPriority.Low;
                    break;
                case 2:
                    bug.Priority = BugPriority.High;
                    break;
                case 3:
                    bug.Priority = BugPriority.Critial;
                    break;
                default:
                    bug.Priority = BugPriority.Normal;
                    break;
            }

            var existingBug = repository.FirstOrDefault(x => x.ID == bug.ID);
            if(existingBug == null) {
                return;
            }

            int index = repository.IndexOf(existingBug);
            repository[index] = bug;
        }

        public void Delete(string id) {
            var guid = new Guid(id);
            var bug = repository.FirstOrDefault(x => x.ID == guid);
            if(bug == null) {
                return;
            }

            int index = repository.IndexOf(bug);
            repository.RemoveAt(index);
        }
    }
}
