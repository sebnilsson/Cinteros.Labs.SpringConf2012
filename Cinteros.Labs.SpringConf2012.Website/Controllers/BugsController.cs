using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web.Http;

namespace Cinteros.Labs.SpringConf2012.Website.Controllers
{
    public class BugsController : ApiController
    {
        private const string NamePrefix = "Bug";
        private static readonly BugRepository Repository;

        static BugsController()
        {
            string connectionString = ConfigurationManager.AppSettings["RAVENHQ_CONNECTION_STRING"];
            Repository = new BugRepository(connectionString);
        }

        public IEnumerable<Bug> Get()
        {
            return Repository.List();
        }

        public Bug Post(Bug bug)
        {
            string uniqueName = GetUniqueName();
            bug.Name = uniqueName;
            bug.PriorityIndex = 1;

            Repository.Add(bug);
            return bug;
        }

        public Bug PutBug(int id, Bug bug)
        {
            Repository.Update(bug);
            return bug;
        }

        public bool Delete(string id)
        {
            return Repository.Delete(id);
        }

        private static string GetUniqueName()
        {
            var allPosts = Repository.List();

            int index = 1;
            string uniqueName;
            do
            {
                uniqueName = string.Format("{0} {1}", NamePrefix, index);
                index++;
            }
            while (allPosts.Any(x => x.Name.Equals(uniqueName, StringComparison.InvariantCultureIgnoreCase)));
            return uniqueName;
        }
    }
}