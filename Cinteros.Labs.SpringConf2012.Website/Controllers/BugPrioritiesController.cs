using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Cinteros.Labs.SpringConf2012.Website.Controllers
{

    public class BugPrioritiesController : ApiController
    {
        static BugPrioritiesController()
        {
            BugPriorities = new List<BugPriority>
                                {
                                    BugPriority.Low,
                                    BugPriority.Normal,
                                    BugPriority.High,
                                    BugPriority.Critial,
                                };
        }

        private static readonly List<BugPriority> BugPriorities;

        public IEnumerable<BugPriority> Get()
        {
            return BugPriorities;
        }
    }
}