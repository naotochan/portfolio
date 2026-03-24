import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "",
  clientId: "",
  token: "",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      // Site Config
      {
        name: "site",
        label: "Site Settings",
        path: "content",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
          global: true,
        },
        match: {
          include: "site",
        },
        fields: [
          { type: "string", name: "name", label: "Name", required: true },
          { type: "string", name: "tagline", label: "Tagline", required: true },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          { type: "string", name: "email", label: "Email" },
          { type: "string", name: "availability", label: "Availability Status" },
          { type: "string", name: "location", label: "Location" },
          { type: "string", name: "timezone", label: "Timezone" },
          {
            type: "object",
            name: "social",
            label: "Social Links",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.label || "New Link" }),
            },
            fields: [
              { type: "string", name: "label", label: "Label (e.g. GitHub, YouTube)", required: true },
              { type: "string", name: "url", label: "URL", required: true },
              { type: "string", name: "icon", label: "Icon Key (github, twitter, instagram, youtube, patreon, soundcloud, linkedin, discord, spotify, bandcamp, vimeo, behance, dribbble, mastodon, bluesky, threads, tiktok)" },
            ],
          },
        ],
      },

      // About
      {
        name: "about",
        label: "About Page",
        path: "content",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        match: {
          include: "about",
        },
        fields: [
          { type: "string", name: "headline", label: "Headline" },
          { type: "string", name: "tagline", label: "Tagline" },
          { type: "image", name: "portrait", label: "Portrait Image" },
          { type: "string", name: "bio", label: "Bio", ui: { component: "textarea" } },
          {
            type: "object",
            name: "skills",
            label: "Skills",
            list: true,
            fields: [
              { type: "string", name: "category", label: "Category Name" },
              { type: "string", name: "items", label: "Skills", list: true },
            ],
          },
          {
            type: "object",
            name: "timeline",
            label: "Timeline",
            list: true,
            fields: [
              { type: "string", name: "year", label: "Year" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
            ],
          },
          {
            type: "string",
            name: "currentlyExploring",
            label: "Currently Exploring",
            list: true,
          },
        ],
      },

      // Blog
      {
        name: "blog",
        label: "Blog Posts",
        path: "content/blog",
        format: "mdx",
        fields: [
          { type: "string", name: "title", label: "Title", required: true, isTitle: true },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          { type: "string", name: "tags", label: "Tags", list: true },
          { type: "datetime", name: "date", label: "Date", required: true },
          { type: "image", name: "image", label: "Cover Image" },
          { type: "rich-text", name: "body", label: "Body", isBody: true },
        ],
      },

      // Projects
      {
        name: "projects",
        label: "Projects",
        path: "content/projects",
        format: "mdx",
        fields: [
          { type: "string", name: "title", label: "Title", required: true, isTitle: true },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          { type: "string", name: "tags", label: "Tags", list: true },
          { type: "datetime", name: "date", label: "Date", required: true },
          { type: "image", name: "image", label: "Cover Image" },
          { type: "string", name: "github", label: "GitHub URL" },
          { type: "boolean", name: "featured", label: "Featured" },
          { type: "rich-text", name: "body", label: "Body", isBody: true },
        ],
      },

      // Apps
      {
        name: "apps",
        label: "Apps",
        path: "content/apps",
        format: "json",
        fields: [
          { type: "string", name: "title", label: "Title", required: true, isTitle: true },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          { type: "string", name: "platform", label: "Platform (e.g. iOS / Android)" },
          { type: "string", name: "tags", label: "Tags", list: true },
          { type: "datetime", name: "date", label: "Date" },
          { type: "image", name: "image", label: "App Icon" },
          {
            type: "object",
            name: "links",
            label: "Links",
            fields: [
              { type: "string", name: "appStore", label: "App Store URL" },
              { type: "string", name: "playStore", label: "Play Store URL" },
              { type: "string", name: "github", label: "GitHub URL" },
            ],
          },
          { type: "boolean", name: "featured", label: "Featured" },
        ],
      },

      // Photography
      {
        name: "photography",
        label: "Photography",
        path: "content/photography",
        format: "json",
        fields: [
          { type: "string", name: "title", label: "Title", required: true, isTitle: true },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          { type: "datetime", name: "date", label: "Date" },
          { type: "string", name: "tags", label: "Tags", list: true },
          { type: "image", name: "photos", label: "Photos", list: true },
          { type: "string", name: "camera", label: "Camera" },
          { type: "string", name: "location", label: "Location" },
        ],
      },

      // Media Art
      {
        name: "mediaArt",
        label: "Media Art",
        path: "content/media-art",
        format: "json",
        fields: [
          { type: "string", name: "title", label: "Title", required: true, isTitle: true },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          { type: "datetime", name: "date", label: "Date" },
          { type: "string", name: "tags", label: "Tags", list: true },
          { type: "string", name: "youtube", label: "YouTube Video ID (e.g. dQw4w9WgXcQ)" },
          { type: "image", name: "media", label: "Media", list: true },
          { type: "string", name: "tools", label: "Tools Used", list: true },
          { type: "string", name: "exhibition", label: "Exhibition" },
        ],
      },
    ],
  },
});
