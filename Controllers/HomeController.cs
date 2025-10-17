using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using OzlasteksanWeb.Models;

namespace OzlasteksanWeb.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult About()
    {
        return View();
    }

    public IActionResult Contact()
    {
        return View();
    }

    [HttpPost]
    public IActionResult Contact(ContactForm model)
    {
        if (ModelState.IsValid)
        {
            // TODO: E-posta gönderme işlemi eklenebilir
            TempData["Message"] = "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.";
            return RedirectToAction("Contact");
        }
        return View(model);
    }

    public IActionResult Quote()
    {
        return View();
    }

    [HttpPost]
    public IActionResult Quote(QuoteForm model)
    {
        if (ModelState.IsValid)
        {
            // TODO: E-posta gönderme işlemi eklenebilir
            TempData["Message"] = "Teklif talebiniz alınmıştır. En kısa sürede size dönüş yapacağız.";
            return RedirectToAction("Quote");
        }
        return View(model);
    }

    public IActionResult Privacy()
    {
        return View();
    }

    public IActionResult CookiePolicy()
    {
        return View();
    }

    public IActionResult TestUI()
    {
        return View();
    }

    public IActionResult ToastTest()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
