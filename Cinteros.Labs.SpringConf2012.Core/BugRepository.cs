using System.Collections.Generic;
using System.Linq;

using Raven.Abstractions.Data;
using Raven.Client;
using Raven.Client.Document;

namespace Cinteros.Labs.SpringConf2012
{
    public class BugRepository
    {
        private IDocumentStore _store;

        public BugRepository(string connectionString)
        {
            var parser = ConnectionStringParser<RavenConnectionStringOptions>.FromConnectionString(connectionString);
            parser.Parse();

            _store = new DocumentStore
                         {
                             ApiKey = parser.ConnectionStringOptions.ApiKey,
                             Url = parser.ConnectionStringOptions.Url,
                         };
            _store.Initialize();
        }

        public IEnumerable<Bug> List()
        {
            using (var session = _store.OpenSession())
            {
                return session.Query<Bug>().ToList();
            }
        }

        public void Add(Bug addedBug)
        {
            using (var session = _store.OpenSession())
            {
                session.Store(addedBug);
                session.SaveChanges();
            }
        }

        public void Update(Bug updatedBug)
        {
            using (var session = _store.OpenSession())
            {
                var exisitingBug = session.Load<Bug>(updatedBug.Id);
                if (exisitingBug == null)
                {
                    return;
                }
                exisitingBug.Description = updatedBug.Description;
                exisitingBug.Hours = updatedBug.Hours;
                exisitingBug.Name = updatedBug.Name;
                exisitingBug.PriorityIndex = updatedBug.PriorityIndex;

                session.SaveChanges();
            }
        }

        public bool Delete(string bugId)
        {
            string ravenId = "Bugs/" + bugId;
            using (var session = _store.OpenSession())
            {
                var exisitingBug = session.Load<Bug>(ravenId);
                if (exisitingBug == null)
                {
                    return false;
                }
                session.Delete(exisitingBug);

                session.SaveChanges();
                return true;
            }
        }
    }
}