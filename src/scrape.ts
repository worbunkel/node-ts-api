import _ from 'lodash';
import fetch from 'node-fetch';
import { Frames } from './Frames';

const linksData = {
  'Contact Lens': { name: 'Contact Lens', nameInUrl: false, code: 'zbq37t' },
  'Alberto Romani': { name: 'Alberto Romani', nameInUrl: true, code: 'zbq2vy' },
  'Anne Klein': { name: 'Anne Klein', nameInUrl: true, code: 'zbq2vz' },
  'Armani Exchange': { name: 'Armani Exchange', nameInUrl: true, code: 'zbq34m' },
  'Bcbg Max Azria': { name: 'Bcbg Max Azria', nameInUrl: true, code: 'zbq2w2' },
  Bebe: { name: 'Bebe', nameInUrl: true, code: 'zbq2w3' },
  'Blue Moon': { name: 'Blue Moon', nameInUrl: true, code: 'zbq2w4' },
  'Boardroom Classics': { name: 'Boardroom Classics', nameInUrl: true, code: 'zbq2w5' },
  'Calvin Klein': { name: 'Calvin Klein', nameInUrl: true, code: 'zbq2wa' },
  Candies: { name: 'Candies', nameInUrl: true, code: 'zbq2wb' },
  Caterpillar: { name: 'Caterpillar', nameInUrl: true, code: 'zbq2wc' },
  'Catherine Deneuve': { name: 'Catherine Deneuve', nameInUrl: true, code: 'zbq2wd' },
  'Chelsea Morgan': { name: 'Chelsea Morgan', nameInUrl: true, code: 'zbq2we' },
  Coach: { name: 'Coach', nameInUrl: true, code: 'zbq393' },
  'Cole Haan': { name: 'Cole Haan', nameInUrl: true, code: 'zbq35c' },
  Columbia: { name: 'Columbia', nameInUrl: true, code: 'zbq35d' },
  Converse: { name: 'Converse', nameInUrl: true, code: 'zbq2wf' },
  Dvf: { name: 'Dvf', nameInUrl: true, code: 'zbq31v' },
  Diesel: { name: 'Diesel', nameInUrl: true, code: 'zbq2wg' },
  Dragon: { name: 'Dragon', nameInUrl: true, code: 'zbq35e' },
  Flexon: { name: 'Flexon', nameInUrl: true, code: 'zbq2wh' },
  Gant: { name: 'Gant', nameInUrl: true, code: 'zbq2wi' },
  Guess: { name: 'Guess', nameInUrl: true, code: 'zbq2wj' },
  'Guess By Marciano': { name: 'Guess By Marciano', nameInUrl: true, code: 'zbq31w' },
  'Harley Davidson': { name: 'Harley Davidson', nameInUrl: true, code: 'zbq2wk' },
  Indi: { name: 'Indi', nameInUrl: true, code: 'zbq2wo' },
  'Jones Ny': { name: 'Jones Ny', nameInUrl: true, code: 'zbq2wp' },
  'Joseph Abboud': { name: 'Joseph Abboud', nameInUrl: true, code: 'zbq38o' },
  'Kate Spade': { name: 'Kate Spade', nameInUrl: true, code: 'zbq2wr' },
  'Kenneth Cole': { name: 'Kenneth Cole', nameInUrl: true, code: 'zbq2ws' },
  Kensie: { name: 'Kensie', nameInUrl: true, code: 'zbq380' },
  Lamb: { name: 'Lamb', nameInUrl: true, code: 'zbq394' },
  Lacoste: { name: 'Lacoste', nameInUrl: true, code: 'zbq2wx' },
  'Leon Max': { name: 'Leon Max', nameInUrl: true, code: 'zbq34z' },
  Longchamp: { name: 'Longchamp', nameInUrl: true, code: 'zbq39k' },
  'Max Studio': { name: 'Max Studio', nameInUrl: true, code: 'zbq2x0' },
  'Michael Kors': { name: 'Michael Kors', nameInUrl: true, code: 'zbq2x1' },
  Nike: { name: 'Nike', nameInUrl: true, code: 'zbq2x2' },
  'Nine West': { name: 'Nine West', nameInUrl: true, code: 'zbq2x4' },
  Oneill: { name: 'Oneill', nameInUrl: true, code: 'zbq34n' },
  Otisgrey: { name: 'Otisgrey', nameInUrl: true, code: 'zbq39f' },
  'Paw Patrol': { name: 'Paw Patrol', nameInUrl: true, code: 'zbq38a' },
  Penguin: { name: 'Penguin', nameInUrl: true, code: 'zbq2x5' },
  'Perry Ellis': { name: 'Perry Ellis', nameInUrl: true, code: 'zbq2x6' },
  Rampage: { name: 'Rampage', nameInUrl: true, code: 'zbq2x7' },
  'Randy Jackson': { name: 'Randy Jackson', nameInUrl: true, code: 'zbq2x8' },
  'Ray Ban': { name: 'Ray Ban', nameInUrl: true, code: 'zbq34b' },
  Raycers: { name: 'Raycers', nameInUrl: true, code: 'zbq2x9' },
  Realtree: { name: 'Realtree', nameInUrl: true, code: 'zbq2xa' },
  'Robert Mitchel': { name: 'Robert Mitchel', nameInUrl: true, code: 'zbq2xb' },
  Salsa: { name: 'Salsa', nameInUrl: true, code: 'zbq2xc' },
  Skechers: { name: 'Skechers', nameInUrl: true, code: 'zbq382' },
  'South Hampton': { name: 'South Hampton', nameInUrl: true, code: 'zbq2xd' },
  Splendor: { name: 'Splendor', nameInUrl: true, code: 'zbq2xe' },
  Stetson: { name: 'Stetson', nameInUrl: true, code: 'zbq2xf' },
  Swarovski: { name: 'Swarovski', nameInUrl: true, code: 'zbq35g' },
  Technolite: { name: 'Technolite', nameInUrl: true, code: 'zbq2xg' },
  'Technolite Flex': { name: 'Technolite Flex', nameInUrl: true, code: 'zbq2xh' },
  'Tony Hawk': { name: 'Tony Hawk', nameInUrl: true, code: 'zbq383' },
  Transformers: { name: 'Transformers', nameInUrl: true, code: 'zbq384' },
  'Under 100': { name: 'Under 100', nameInUrl: true, code: 'zbq2xi' },
  'Value Frames': { name: 'Value Frames', nameInUrl: true, code: 'zbq38b' },
  'Vera Bradley': { name: 'Vera Bradley', nameInUrl: true, code: 'zbq2xj' },
  'Zac Posen': { name: 'Zac Posen', nameInUrl: true, code: 'zbq34o' },
  Progressive: { name: 'Progressive', nameInUrl: true, code: 'zbq2xl' },
  Sunglasses: { name: 'Sunglasses', nameInUrl: true, code: 'zbq2xm' },
  'Business Wear': { name: 'Business Wear', nameInUrl: false, code: 'zbq2yk' },
  Classic: { name: 'Classic', nameInUrl: false, code: 'zbq2yl' },
  Eclectic: { name: 'Eclectic', nameInUrl: false, code: 'zbq2ym' },
  'Retro Vintage': { name: 'Retro Vintage', nameInUrl: false, code: 'zbq2yn' },
  Sporty: { name: 'Sporty', nameInUrl: false, code: 'zbq32f' },
  Trendy: { name: 'Trendy', nameInUrl: false, code: 'zbq2yp' },
  Mens: { name: 'Mens', nameInUrl: true, code: 'zbq2xt' },
  Womens: { name: 'Womens', nameInUrl: true, code: 'zbq2xu' },
  Kids: { name: 'Kids', nameInUrl: true, code: 'zbq2xs' },
  'Eyeglass Shape Aviator': { name: 'Eyeglass Shape Aviator', nameInUrl: false, code: 'zbq325' },
  'Eyeglass Shape Cat Eye': { name: 'Eyeglass Shape Cat Eye', nameInUrl: false, code: 'zbq326' },
  'Eyeglass Shape Oval': { name: 'Eyeglass Shape Oval', nameInUrl: false, code: 'zbq327' },
  'Eyeglass Shape Rectangle': { name: 'Eyeglass Shape Rectangle', nameInUrl: false, code: 'zbq328' },
  'Eyeglass Shape Round': { name: 'Eyeglass Shape Round', nameInUrl: false, code: 'zbq329' },
  'Eyeglass Shape Square': { name: 'Eyeglass Shape Square', nameInUrl: false, code: 'zbq32a' },
  'Face Shape Heart': { name: 'Face Shape Heart', nameInUrl: false, code: 'zbq31j' },
  'Face Shape Oval': { name: 'Face Shape Oval', nameInUrl: false, code: 'zbq31k' },
  'Face Shape Round': { name: 'Face Shape Round', nameInUrl: false, code: 'zbq31l' },
  'Face Shape Square': { name: 'Face Shape Square', nameInUrl: false, code: 'zbq31m' },
  Large: { name: 'Large', nameInUrl: false, code: 'zbq33u' },
  Medium: { name: 'Medium', nameInUrl: false, code: 'zbq33v' },
  Small: { name: 'Small', nameInUrl: false, code: 'zbq33w' },
  Metal: { name: 'Metal', nameInUrl: false, code: 'zbq33e' },
  Plastic: { name: 'Plastic', nameInUrl: false, code: 'zbq33f' },
  Glasses: { name: 'Glasses', nameInUrl: true, code: 'zbq347' },
  '$0 - $100': { name: '$0 - $100', nameInUrl: false, code: '60' },
  '$100 - $150': { name: '$100 - $150', nameInUrl: false, code: '5z' },
  '$150 - $200': { name: '$150 - $200', nameInUrl: false, code: '5y' },
  '$200+': { name: '$200+', nameInUrl: false, code: '5x' },
};

export type FrameImageCategory = keyof typeof linksData;
const cachedData = {};

export const getFramesByCategories = async (selectedKeys: FrameImageCategory[]) => {
  const keysInUrl = _.map(
    _.filter(selectedKeys, selectedKey =>
      _.get(linksData, `[${selectedKey}].nameInUrl`, false),
    ) as FrameImageCategory[],
    _.kebabCase,
  );
  const codesOfSelectedKeys: string[] = _.map(selectedKeys, selectedKey => _.get(linksData, `[${selectedKey}].code`));
  const endOfUrl = `${_.join(keysInUrl, '/')}/${_.join(codesOfSelectedKeys, 'Z')}`;
  if (cachedData[endOfUrl]) {
    return cachedData[endOfUrl];
  }
  try {
    const result = await fetch(`https://www.visionworks.com/${endOfUrl}`, { method: 'GET' });
    const text = await result.text();
    const resultingStrings = text.match(/data-sku=[^>]+/g);
    const insideResultingStrings = _.map(resultingStrings, str => _.first(_.tail(_.split(str, "'"))));
    const parsedToJson = _.map(insideResultingStrings, str => JSON.parse(_.replace(str, /\&#034;/g, '"')));
    cachedData[endOfUrl] = parsedToJson;
    return parsedToJson as Frames[];
  } catch (e) {
    console.error(e, 'Error fetching images', endOfUrl);
  }
};

// const resultingStringsIncludingProduct = _.filter(resultingStrings, str => _.includes(str, 'product'));
// const imageUrls = _.map(resultingStringsIncludingProduct, str => _.last(_.split(str, 'src="')));

// const resultingStrings = text.match(/<a class="checkbox-link "[^>]+>[^>]+>[^>]+>[^>]+>/g);
// const result = [ '<a class="checkbox-link " href="/eyewear/zbq37tZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>Contact Lens (92)</a>',
// '<a class="checkbox-link " href="/glasses/alberto-romani/zbq2vyZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/anne-klein/zbq2vzZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/armani-exchange/zbq34mZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/bcbg-max-azria/zbq2w2Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/bebe/zbq2w3Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/blue-moon/zbq2w4Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/boardroom-classics/zbq2w5Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/calvin-klein/zbq2waZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/candies/zbq2wbZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/caterpillar/zbq2wcZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/catherine-deneuve/zbq2wdZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/chelsea-morgan/zbq2weZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/coach/zbq393Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/cole-haan/zbq35cZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/columbia/zbq35dZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/converse/zbq2wfZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/dvf/zbq31vZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/diesel/zbq2wgZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/dragon/zbq35eZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/flexon/zbq2whZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/gant/zbq2wiZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/guess/zbq2wjZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/guess-by-marciano/zbq31wZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/harley-davidson/zbq2wkZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/indi/zbq2woZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/jones-ny/zbq2wpZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/joseph-abboud/zbq38oZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/kate-spade/zbq2wrZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/kenneth-cole/zbq2wsZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/kensie/zbq380Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/lamb/zbq394Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/lacoste/zbq2wxZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/leon-max/zbq34zZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/longchamp/zbq39kZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/max-studio/zbq2x0Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/michael-kors/zbq2x1Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/nike/zbq2x2Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/nine-west/zbq2x4Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/oneill/zbq34nZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/otisgrey/zbq39fZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/paw-patrol/zbq38aZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/penguin/zbq2x5Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/perry-ellis/zbq2x6Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/rampage/zbq2x7Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/randy-jackson/zbq2x8Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/ray-ban/zbq34bZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/raycers/zbq2x9Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/realtree/zbq2xaZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/robert-mitchel/zbq2xbZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/salsa/zbq2xcZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/skechers/zbq382Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/south-hampton/zbq2xdZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/splendor/zbq2xeZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/stetson/zbq2xfZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/swarovski/zbq35gZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/technolite/zbq2xgZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/technolite-flex/zbq2xhZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/tony-hawk/zbq383Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/transformers/zbq384Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/under-100/zbq2xiZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/value-frames/zbq38bZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/vera-bradley/zbq2xjZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/zac-posen/zbq34oZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>\n<span>',
// '<a class="checkbox-link " href="/glasses/progressive/zbq2xlZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>Progressive (2160)</a>',
// '<a class="checkbox-link " href="/glasses/sunglasses/zbq2xmZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>Sunglasses (2126)</a>',
// '<a class="checkbox-link " href="/glasses/zbq2ykZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>Business Wear (193)</a>',
// '<a class="checkbox-link " href="/glasses/zbq2ylZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>Classic (726)</a>',
// '<a class="checkbox-link " href="/glasses/zbq2ymZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>Eclectic (90)</a>',
// '<a class="checkbox-link " href="/glasses/zbq347Zzbq2yn" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>Retro-Vintage (256)</a>',
// '<a class="checkbox-link " href="/glasses/zbq347Zzbq32f" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>Sporty (143)</a>',
// '<a class="checkbox-link " href="/glasses/zbq347Zzbq2yp" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>Trendy (893)</a>',
// '<a class="checkbox-link " href="/glasses/mens/zbq2xtZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>Men&#39;s (998)</a>',
// '<a class="checkbox-link " href="/glasses/womens/zbq2xuZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>Women&#39;s (1423)</a>',
// '<a class="checkbox-link " href="/glasses/kids/zbq2xsZzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>Kids&#39; (258)</a>',
// '<a class="checkbox-link " href="/glasses/zbq325Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i><img src="/images/eyeglassShape/Aviator.png" alt="">',
// '<a class="checkbox-link " href="/glasses/zbq326Zzbq347" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i><img src="/images/eyeglassShape/Cat-Eye.png" alt="">',
// '<a class="checkbox-link " href="/glasses/zbq347Zzbq327" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i><img src="/images/eyeglassShape/Oval.png" alt="">',
// '<a class="checkbox-link " href="/glasses/zbq347Zzbq328" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i><img src="/images/eyeglassShape/Rectangle.png" alt="">',
// '<a class="checkbox-link " href="/glasses/zbq347Zzbq329" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i><img src="/images/eyeglassShape/Round.png" alt="">',
// '<a class="checkbox-link " href="/glasses/zbq347Zzbq32a" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i><img src="/images/eyeglassShape/Square.png" alt="">',
// '<a class="checkbox-link " href="/glasses/zbq347Zzbq31j" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i><img src="/images/faceShape/Heart.png" alt="">',
// '<a class="checkbox-link " href="/glasses/zbq347Zzbq31k" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i><img src="/images/faceShape/Oval.png" alt="">',
// '<a class="checkbox-link " href="/glasses/zbq347Zzbq31l" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i><img src="/images/faceShape/Round.png" alt="">',
// '<a class="checkbox-link " href="/glasses/zbq347Zzbq31m" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i><img src="/images/faceShape/Square.png" alt="">',
// '<a class="checkbox-link " href="/glasses/zbq347Zzbq33u" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>Large (1162)</a>',
// '<a class="checkbox-link " href="/glasses/zbq347Zzbq33v" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>Medium (1053)</a>',
// '<a class="checkbox-link " href="/glasses/zbq347Zzbq33w" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>Small (96)</a>',
// '<a class="checkbox-link " href="/glasses/zbq347Zzbq33e" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>Metal (814)</a>',
// '<a class="checkbox-link " href="/glasses/zbq347Zzbq33f" role="checkbox" aria-checked="false">\n<i class="fa" aria-hidden="true"></i>Plastic (1487)</a>' ];
// const hrefs = _.map(result, str => _.first(_.split(_.last(_.split(str, 'href="')), '"')))
// const linkNames = _.map(result, str => {
//   const href = _.first(_.split(_.last(_.split(str, 'href="')), '"'));
//   let name = _.first(_.split(_.last(_.split(href, '/glasses/')), '/'));
//   let nameInUrl = true;
//   if(name === '' || _.includes(name, 'zbq')){
//     const afterI = _.last(_.split(str, '</i>'));
//     name = _.first(_.split(afterI, '('));
//     nameInUrl = false;
//     if(name === afterI){
//       // console.log(href);
//       if(_.includes(afterI, 'img')){
//         // <img src="/images/eyeglassShape/Aviator.png" alt="">
//         name = _.replace(_.first(_.split(_.last(_.split(afterI, '/images/')), '.')), '/', ' ');
//       } else {
//         nameInUrl = true;
//         name = _.first(_.split(_.last(_.split(href, 'glasses/')), '/'));
//       }
//     }
//   }
//   return {name: _.startCase(name), nameInUrl};
// });
// const linkCodes = _.map(hrefs, href => _.first(_.filter(_.split(_.last(href.match(/zbq.+/g)), 'Z'), str => !_.includes(str, 347))));
// const linksData = _.map(linkNames, ( linkName, index ) => ({...linkName, code: linkCodes[index]}))
// const linksDataGroupedByName = _.groupBy(linksData, 'name');
// console.log(linksDataGroupedByName);
// console.log(linkCodes);
// };
// asdf()

// func();
