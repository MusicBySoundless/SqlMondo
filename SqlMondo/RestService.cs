using Newtonsoft.Json;
using SqlMondo.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SqlMondo
{
    public class RestService
    {
        readonly HttpClient client;
        public RestService()
        {
            client = new HttpClient
            {
                MaxResponseContentBufferSize = 256000
            };
        }

        public async Task<Token> Login(User user)
        {
            var postData = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("login", user.Login),
                new KeyValuePair<string, string>("password", user.Password)
            };
            var content = new FormUrlEncodedContent(postData);
            var weburl = "http://46.41.137.179/remoteapi/login";
            var response = await PostResponse(weburl, content);
            return response;
        }

        public async Task<Token> PostResponse(string weburl, FormUrlEncodedContent content)
        {
            var response = await client.PostAsync(weburl, content);
            var jsonResult = response.Content.ReadAsStringAsync().Result;
            Console.WriteLine(jsonResult.ToString());
            var token = JsonConvert.DeserializeObject<Token>(jsonResult);
            return token;
        }
    }
}
