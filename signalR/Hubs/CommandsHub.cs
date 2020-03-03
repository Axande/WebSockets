using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace WebSockets.signalR.Hubs
{
    public class CommandsHub:Hub
    {
        public async Task SendMessage(string user, string message)
        { 
            Console.WriteLine("SendMessage");
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
