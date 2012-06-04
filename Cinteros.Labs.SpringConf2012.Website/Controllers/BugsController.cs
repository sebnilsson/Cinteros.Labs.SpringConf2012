using System.Collections.Generic;
using System.Configuration;
using System.Web.Http;

namespace Cinteros.Labs.SpringConf2012.Website.Controllers {
    public class BugsController : ApiController {
        private static BugRepository _repository;

        static BugsController() {
            string connectionString = ConfigurationManager.AppSettings["RAVENHQ_CONNECTION_STRING"];
            _repository = new BugRepository(connectionString);
        }

        public IEnumerable<Bug> Get() {
            return _repository.List();
        }

        public Bug Post(Bug bug) {
            _repository.Add(bug);
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

            _repository.Update(bug);
        }

        public void Delete(string id) {
            _repository.Delete(id);
        }
    }
}
