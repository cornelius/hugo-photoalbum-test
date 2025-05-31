import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const OUTPUT_DIR = path.resolve(__dirname, '../public');

const albums = [
  {
    name: 'places/london',
    images: ['big-ben.webp', 'pub.webp', 'tower-bridge.webp'],
    keyTexts: ['London', 'Tagged with London'],
  },
  {
    name: 'places/berlin',
    images: [
      '20050326-IMG_2832.JPG',
      '20200724_174828-EFFECTS.jpg',
      'img-44-brandenburger-tor.webp',
      'PXL_20211016_095800293.jpg'
    ],
    keyTexts: ['Berlin', 'Tagged with Berlin'],
  },
  {
    name: 'people/john-doe',
    images: [
      'big-ben.webp',
      'img-42-golden-gate.webp',
      'img-43-three-sisters.webp',
      'img-44-brandenburger-tor.webp',
      'pub.webp',
      'tower-bridge.webp'
    ],
    keyTexts: ['John Doe', 'Tagged with John'],
  },
  {
    name: 'travel/berlin-2020',
    images: [
      '20200724_174828-EFFECTS.jpg',
      'img-44-brandenburger-tor.webp'
    ],
    keyTexts: ['Berlin 2020', 'Tagged with Berlin'],
  },
  {
    name: 'travel/london-2011',
    images: ['london-trip1.webp', 'london-trip2.webp'],
    keyTexts: ['London 2011', 'Tagged with London'],
  },
  {
    name: 'all/1996',
    images: ['family-album-1996.webp', 'random-scene.webp'],
    keyTexts: ['1996'],
  },
  {
    name: 'all/2004',
    images: ['20040302-IMG_1283.JPG', '20040307-IMG_1324.JPG'],
    keyTexts: ['2004'],
  },
  {
    name: 'all/2005',
    images: ['20050326-IMG_2832.JPG'],
    keyTexts: ['2005'],
  },
  {
    name: 'all/2011',
    images: ['big-ben.webp', 'pub.webp', 'tower-bridge.webp'],
    keyTexts: ['2011'],
  },
  {
    name: 'all/2020',
    images: [
      '20200724_174828-EFFECTS.jpg',
      'img-42-golden-gate.webp',
      'img-43-three-sisters.webp',
      'img-44-brandenburger-tor.webp'
    ],
    keyTexts: ['2020'],
  },
  {
    name: 'all/2021',
    images: ['PXL_20211016_095800293.jpg'],
    keyTexts: ['2021'],
  },
];

test.describe('Generated HTML', () => {
  albums.forEach(album => {
    test(`Album/page "${album.name}" contains correct images and texts`, async ({ page }) => {
      const htmlPath = path.join(OUTPUT_DIR, album.name, 'index.html');
      expect(fs.existsSync(htmlPath)).toBeTruthy();

      await page.goto('file://' + htmlPath);

      // Check <title>
      const title = await page.title();
      expect(title).toContain(album.keyTexts[0]);

      // Check main heading
      const h1 = await page.locator('h1').first();
      const h1Text = await h1.textContent();
      expect(album.keyTexts.some(t => h1Text && h1Text.includes(t))).toBeTruthy();

      // Check images: <img> tags are inside <figure> inside <a.gallery-item>
      for (const img of album.images) {
        // Check for an <a> element with class "gallery-item" and href containing the image filename
        const aLocator = page.locator(`a.gallery-item[href*="${img}"]`);
        await expect(aLocator).toHaveCount(1);

        // Check that this <a> contains an <img> tag
        const imgLocator = aLocator.locator('img');
        await expect(imgLocator).toHaveCount(1);
      }

      // Check key texts anywhere in the page
      for (const text of album.keyTexts) {
        await expect(page.locator(`:text("${text}")`)).not.toHaveCount(0);
      }
    });
  });
});

test.describe('Homepage', () => {
  test('Homepage displays correct title', async ({ page }) => {
    const homepagePath = path.join(OUTPUT_DIR, 'index.html');
    expect(fs.existsSync(homepagePath)).toBeTruthy();

    await page.goto('file://' + homepagePath);

    // Check <title>
    const title = await page.title();
    expect(title).toContain("Hugo Photoalbum Test");
  });

  test('Homepage shows the four albums People, Places, Travel, Zeit', async ({ page }) => {
    const homepagePath = path.join(OUTPUT_DIR, 'index.html');
    expect(fs.existsSync(homepagePath)).toBeTruthy();

    await page.goto('file://' + homepagePath);

    const albumLinks = [
      { title: 'People', url: '/people/' },
      { title: 'Places', url: '/places/' },
      { title: 'Travel', url: '/travel/' },
      { title: 'Zeit', url: '/all/' }
    ];

    for (const { title, url } of albumLinks) {
      // Find the .card with the correct h2 text
      const card = page.locator('.card', { has: page.locator('h2', { hasText: title }) });
      await expect(card).toHaveCount(1);

      // Check the href attribute
      const href = await card.getAttribute('href');
      expect(href).toBe(url);
    }
  });
});

test.describe('Album subalbums', () => {
  const albumSubalbums = [
    {
      album: 'People',
      url: '/people/',
      subalbums: [
        { title: 'John Doe', url: '/people/john-doe/' }
      ]
    },
    {
      album: 'Places',
      url: '/places/',
      subalbums: [
        { title: 'Berlin', url: '/places/berlin/' },
        { title: 'London', url: '/places/london/' }
      ]
    },
    {
      album: 'Travel',
      url: '/travel/',
      subalbums: [
        { title: 'Berlin 2020', url: '/travel/berlin-2020/' },
        { title: 'London 2011', url: '/travel/london-2011/' }
      ]
    },
    {
      album: 'Zeit',
      url: '/all/',
      subalbums: [
        { title: '2004', url: '/all/2004/' },
        { title: '2005', url: '/all/2005/' },
        { title: '2011', url: '/all/2011/' },
        { title: '2020', url: '/all/2020/' },
        { title: '2021', url: '/all/2021/' }
      ]
    }
  ];

  for (const { url, subalbums } of albumSubalbums) {
    test(`Album page ${url} lists the expected subalbums`, async ({ page }) => {
      const albumPath = path.join(OUTPUT_DIR, url.replace(/^\//, ''), 'index.html');
      expect(fs.existsSync(albumPath)).toBeTruthy();

      await page.goto('file://' + albumPath);

      for (const { title, url: subUrl } of subalbums) {
        // Check for a .card with the correct h2 and href
        const card = page.locator('.card', { has: page.locator('h2', { hasText: title }) });
        await expect(card).toHaveCount(1);
        const href = await card.getAttribute('href');
        expect(href).toBe(subUrl);
      }
    });
  }
});
