using System.Collections.Generic;
using System.Web.Http;

namespace Cinteros.Labs.SpringConf2012.Website.Controllers {
    public class BugPrioritiesController : ApiController {
        public IEnumerable<BugPriority> Get() {
            return new[] {
                BugPriority.Low,
                BugPriority.Normal,
                BugPriority.High,
                BugPriority.Critial,
            };
        }
    }
}