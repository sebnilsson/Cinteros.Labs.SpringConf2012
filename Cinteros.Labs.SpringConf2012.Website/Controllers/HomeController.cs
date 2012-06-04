using System.Web.Mvc;

namespace Cinteros.Labs.SpringConf2012.Website.Controllers {
    public class HomeController : Controller {
        public ActionResult Index() {
            ViewBag.Title = "Bugs";
            return View();
        }

        public ActionResult About() {
            ViewBag.Title = "About";
            return View();
        }
    }
}
