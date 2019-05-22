import { ObjectType, Field, Resolver, Query, InputType, Mutation, Arg } from 'type-graphql';
import _ from 'lodash';
import { FrameImageCategory, getFramesByCategories } from './scrape';

@ObjectType()
class Images {
  @Field(type => [String])
  imageThumbs: string[];

  @Field(type => [String])
  imageSlides: string[];
}

@ObjectType()
export class Frames {
  @Field()
  skuId: string;

  @Field()
  brand: string;
  @Field()
  name: string;

  @Field()
  frameType: string;

  @Field()
  color: string;
  @Field()
  progressive: boolean;

  @Field()
  inventory: string;

  @Field()
  oos: boolean;

  @Field()
  listPrice: string;

  @Field()
  originalPrice: string;

  @Field()
  price: string;

  @Field()
  discount: string;

  @Field()
  seoUrl: string;

  @Field()
  frameImage: string;

  @Field()
  limitedQuantity: boolean;

  @Field()
  springHinges: boolean;

  @Field()
  new: boolean;

  @Field()
  bestSeller: boolean;

  @Field()
  clearance: boolean;

  @Field()
  position: number;

  @Field()
  availableInStore: string;

  @Field()
  bannerText: string;

  @Field()
  bannerTextColor: string;

  @Field()
  bannerColor: string;

  @Field()
  clearanceDescription: string;

  @Field()
  wishClass: string;

  @Field()
  wishLabel: string;

  @Field()
  imageUrl: string;

  @Field()
  male: boolean;

  @Field()
  female: boolean;

  @Field()
  insuranceEligible: boolean;

  @Field()
  material: string;

  @Field()
  gender: string;

  @Field()
  size: string;

  @Field()
  bridgeWidth: string;

  @Field()
  lensWidth: string;

  @Field()
  frameWidth: string;

  @Field()
  templeLength: string;

  @Field()
  description: string;

  @Field()
  legacyId: string;

  @Field()
  writeReviewURL: string;

  @Field()
  category: string;

  @Field()
  prodImgALt: string;

  @Field()
  images: Images;
}

@InputType()
class FramesInputType {
  @Field()
  categoriesJson: string;
}

@Resolver(Frames)
export class FramesResolver {
  @Query(returns => [Frames])
  async Frames(@Arg('framesInputData') framesInputData: FramesInputType) {
    const categories = JSON.parse(framesInputData.categoriesJson);
    return await getFramesByCategories(categories);
  }
}
