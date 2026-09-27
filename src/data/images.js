// Every photo on the site lives in /public/images and is referenced from here.
// To use your own photography, overwrite a file with the same name
// (or add a new file and change its path below).
const img = (name) => `/images/${name}.webp`

export const IMAGES = {
  heroHome: img('heroHome'),
  heroAbout: img('heroAbout'),
  heroPackages: img('heroPackages'),
  heroUmrah: img('heroUmrah'),
  heroContact: img('heroContact'),
  ctaBanner: img('ctaBanner'),

  dubai: img('dubai'),
  turkey: img('turkey'),
  malaysia: img('malaysia'),
  thailand: img('thailand'),
  baku: img('baku'),
  maldives: img('maldives'),
  maldivesVilla: img('maldivesVilla'),
  hunza: img('hunza'),
  kalam: img('kalam'),
  neelum: img('neelum'),

  storyMain: img('storyMain'),
  storyTop: img('storyTop'),
  storyBottom: img('storyBottom'),
}

/** Avatar photos in /public/images/avatars, e.g. avatar('women', 44) → women-44.jpg */
export const avatar = (gender, n) => `/images/avatars/${gender}-${n}.jpg`
