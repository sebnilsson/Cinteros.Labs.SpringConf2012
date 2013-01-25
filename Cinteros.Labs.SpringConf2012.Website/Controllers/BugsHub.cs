using Microsoft.AspNet.SignalR;

namespace Cinteros.Labs.SpringConf2012.Website.Controllers
{
    public class BugsHub : Hub
    {
        public void BugAdded(Bug bug)
        {
            Clients.All.addBug(bug);
        }

        public void BugUpdated(Bug bug, int priorityIndex)
        {
            Clients.All.updateBug(bug, priorityIndex);
        }

        public void BugRemoved(Bug bug)
        {
            Clients.All.removeBug(bug);
        }
    }
}