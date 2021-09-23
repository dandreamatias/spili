|---
articleTitle: Welcome to Spili! <small>🎉</small>
articleDate: 19/08/2021
articleDescription: This article it's a good starting point if you are a new user. Learn how to create articles, modify the blog title, customize the template and how to build your new blog. Let's become a Spili bloggin master!
---|

This article it's only a getting started, when you are confortable with these basic notions simply delete the `welcome-to-spili.md` file inside the articles folder. If you wanna know more about Spili visit the official [documentation](#asd) page.

## Create a new article

Create a new article in Spili it's super easy, you only have to:

1. add a new file with extension `.md` inside the **articles** folder.
2. add the **mandatory header** at the top the file:

```
|---
title: Example Title
date: the current date
description: this is the description preview for my new example article
---|
```

3. type your content using the markdown syntax under the header:

```
|---
title: Example Title
date: the current date
description: this is the description preview for my new example article
---|

## Hello world!
```

after these three simple points you'll see that a new article has been automatically listed in home page! It's important to know thats articles are shorted by date.

## Edit blog infos

You can find a spili.json file at the root level, it's a file generated automatically during the init process, inside there are all the generic informations of the website and the can be edited in every moment. You can simply modify the name of the website changing the default name: "Spili" in another word.

## Build and deploy your blog on github 🚀

Now that you have learned how to create articles and change the general informations it's time to build the blog! tipe `spili build` and a new folder called dist will appear. Copy and paste the content of the dist folder in your gh-pages branch on github and your blog will be online!
