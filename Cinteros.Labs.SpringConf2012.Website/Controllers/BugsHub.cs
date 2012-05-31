using SignalR.Hubs;

namespace Cinteros.Labs.SpringConf2012.Website.Controllers {
    public class BugsHub : Hub {
        public void BugAdded(Bug bug) {
            Clients.addBug(bug);
        }

        public void BugUpdated(Bug bug, int priorityIndex) {
            Clients.updateBug(bug, priorityIndex);
        }

        public void BugRemoved(Bug bug) {
            Clients.removeBug(bug);
        }
    }
}