---
title: "How I finally started my game using Scenario"
slug: how-i-finally-started-my-game-using-scenario
summary: "I’ve wanted to build my game for a while. But I needed a solid visual identity to finally start coding. Generic AIs were too inconsistent for a real project. The fix was **Scenario.com**. By training a custom model on 25 specific images (refined with **Claude** to hit a \"Zelda meets Clash Royale\" vibe), I finally got a unified look. AI didn't do the creative work for me; it just removed the technical wall. **Bestiary is now officially in development.**"
publishedAt: 2026-02-17
complexity: beginner
topics: Design
coverImage: /images/resources/how-i-finally-started-my-game-using-scenario/renard.png
coverAlt: "Renard"
---
I’ve had this project in the back of my mind forever: a browser-based game similar to *Travian*, but with animal armies. The logic was done, the idea was solid, but I kept hitting the same wall: **the visuals**.

I am not a graphic designer. It’s hard to stay motivated to code a world you can’t actually see. For a long time, the project just sat there because I couldn't "feel" the vibe. I eventually turned to AI, not just to generate random cool pictures, but to build a consistent art style that made the project feel real.

## **Why ChatGPT and Gemini don't work for games**

I started by testing DALL-E 3 and Gemini. They’re great for a one-off blog illustration, but for a game, they are almost useless.

The main issue is what I call the "visual lottery." You get a perfect warrior on your first try, but when you ask for that same character from behind or with a different weapon, the AI changes everything: the style, the colors, the proportions. A game needs consistency to feel immersive. Without it, you just have a messy collection of images that don't belong together.

## **Building a custom "Style Brain"**

That’s why I switched to [**Scenario.com**](http://Scenario.com). Unlike general AI tools, Scenario lets you train your own specific models.

### **Thinking it through with Claude**

Scenario is a great engine, but it needs specific directions. I used **Claude** as a sort of creative partner to define the "Bible" for the game's look. I worked on a prompt formula that sat right between the "toy" look of *Clash Royale* and the soft, painterly lighting of *Zelda (Switch version)*.

To give you an idea, here are the types of precise prompts I developed with Claude to feed into my Scenario model:

- **For a village illustration:** *"Top-down bird's eye view medieval fantasy village, seen from directly above, small clustered buildings with thatched and wooden roofs, narrow cobblestone streets, small stone church in center, horse carts and hay bales, Clash Royale art style, Nintendo Switch Zelda aesthetic, 3D cartoon render, vibrant warm colors, perfectly vertical top-down view"*
- **For a fox character:** *"Fox with light leather shoulder pads and sharpened bone dagger in mouth, in autumn birch forest with fallen leaves, Clash Royale art style, Nintendo Switch Zelda aesthetic, 3D cartoon render, vibrant colors, cunning stalking pose, game creature design, high detail"*

### **The "5-Image" mistake**

At first, I tried to train a model using only five images. It was a disaster. The AI didn't have enough data to understand the style, so it produced "glitchy" results that looked like a bad filter.

I learned that the sweet spot is actually between **15 and 25 high-quality images**. Once I spent the time to get those first assets perfect, I fed them into Scenario and let it cook for a few hours.

## The Results: A Glimpse into *Bestiary*'s World

After that training, I finally had a model that "knew" my game. Now, whether I ask for a village view or a fox warrior, the lighting and textures match perfectly. It finally feels like a real product.

Here are some examples of assets generated with my custom Scenario model, showcasing the consistent style:

![Vautour](/images/resources/how-i-finally-started-my-game-using-scenario/vautour.png)

![Hippo](/images/resources/how-i-finally-started-my-game-using-scenario/hippo.png)

![Bucherons](/images/resources/how-i-finally-started-my-game-using-scenario/bucherons.png)

## What’s Next for *Bestiary*?

This journey took me from 0 to 1. Without this tech, the project would still be a blank page in a notebook. Instead, **Bestiary** is now officially in development.

Using AI didn't replace my ideas; it just got rid of the technical barrier that was stopping me from actually building them.

### 💡 A quick tip if you try this

Don't rush the training. If your 25 base images are inconsistent, your model will be a mess. Take the time to get your initial set right—it’s the difference between a professional-looking game and an "AI slop" project.

**Bestiary is under way, and I'll be sharing more of this world soon.**

![Village](/images/resources/how-i-finally-started-my-game-using-scenario/village.png)
