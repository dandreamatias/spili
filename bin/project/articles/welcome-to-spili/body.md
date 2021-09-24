This article it's only a getting started, when you are confortable with these basic notions simply delete the `welcome-to-spili` folder inside articles. If you wanna know more about Spili visit the official [documentation](https://spili.netlify.app/) page.

## Create a new article

Create a new article in Spili it's super easy, you only have to use the spili CLI:

`spili article "Title of the article"`

After this simple comand you'll see that:

- a new article has been automatically listed in home page!
- a new folder called "title-of-the-article" with two new file has appeared inside the articles folder.

  body.md is where you can write your article in markdown, info.json is a json file where you can specify: the title, a small description and the date.

It's important to know thats articles are shorted by date.

## Edit blog infos

You can find a `spili.json` file at the root level of your project. It's a file generated automatically during the init process, inside there are all the generic informations of the website.

You can simply modify the name of the website changing the default name: "Spili" in another word.

## Build and deploy your blog on Netlify 🚀

Now that you have learned how to create articles and change the general blog informations it's time to build the blog! As always, we use the Spili cli, type:  
`spili build`  
After few seconds we'll have the result of the build inside the `dist` folder. [Netlify](https://www.netlify.com/) allow us to drag and drop a folder to instantly deploy a website. You can register and use it for free [here](https://app.netlify.com/signup).  
Drag and drop the dist folder in your netlify deploy section:
![netlify deploy](netlify.png)
After that your blog will be online in seconds!
