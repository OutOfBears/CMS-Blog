using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using System.Threading.Tasks;
using CMS.Services;
using System;
using Microsoft.Extensions.FileProviders;
using System.IO;

namespace CMS
{
    public class Startup
    {
        private static bool isDev;
        public IConfiguration Configuration { get; }

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json",
                    optional: false,
                    reloadOnChange: true)
                .AddEnvironmentVariables();

            if (!Directory.Exists("Thumbnails"))
                Directory.CreateDirectory("Thumbnails");

            isDev = env.IsDevelopment();
            if (isDev)
                builder.AddUserSecrets<Startup>();

            Configuration = builder.Build();
        }

        private void InitializeDatabase(MongoClient client)
        {
            var Database = client.GetDatabase(Configuration["MONGO_DATABASE"]);
            if (Database == null)
                throw new Exception("Couldn't find database");

            // Initialize required collections
            var collections = Database.ListCollectionNames()
                .ToList();
            var requiredCollections = new string[]{ "users", "posts" };

            foreach (var collection in requiredCollections)
                if(!collections.Contains(collection))
                    Database.CreateCollection(collection);
        }

        private void EnsureConfigVar(string name)
        {
            if (Configuration[name] == null)
                throw new Exception($"Please specify {name} in settings");
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("default",
                    builder =>
                    {
                        if (isDev) 
                            builder.AllowAnyOrigin()
                                .AllowAnyHeader()
                                .AllowCredentials()
                                .AllowAnyMethod();
                    });
            });

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });



            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(o =>
                {
                    o.Cookie.Name = "BLOG-AUTH";
                    o.Events.OnRedirectToLogin = UnauthorizedLogin;
                    o.Events.OnRedirectToAccessDenied = UnauthorizedLogin;
                });


            // Initialize the database and get the database
            EnsureConfigVar("MONGO_URL");
            EnsureConfigVar("MONGO_DATABASE");

            var MongoDB = new MongoClient(Configuration["MONGO_URL"]);
            InitializeDatabase(MongoDB);

            services.AddSingleton(MongoDB.GetDatabase(Configuration["MONGO_DATABASE"]));
            services.AddSingleton<UserService>();
            services.AddSingleton<PostsService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "Thumbnails")),
                RequestPath = "/thumbnails"
            });

            app.UseAuthentication();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "api/{controller}/{action=Index}/{id?}");
            });
            
            //app.UseMvcWithDefaultRoute();


            if (!env.IsDevelopment())
            {
                app.UseSpa(spa =>
                {
                    spa.Options.SourcePath = "ClientApp";
                    //spa.UseReactDevelopmentServer(npmScript: "start");
                });
            }

            
        }

        private Task UnauthorizedLogin(RedirectContext<CookieAuthenticationOptions> context)
        {
            context.Response.StatusCode = 401;
            return Task.CompletedTask;
        }
    }
}
