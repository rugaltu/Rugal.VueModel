using Microsoft.AspNetCore.Mvc;

namespace Rugal.VueModel3.Controller
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public dynamic GetTest()
        {
            return new
            {
                Name = "TestA",
                Value = "TestB"
            };
        }

        public record PostTestModel
        {
            public string Name { get; set; }
            public string Value { get; set; }
        }

        [HttpPost]
        public dynamic PostTest(PostTestModel Model)
        {
            return Model;
        }
    }
}
