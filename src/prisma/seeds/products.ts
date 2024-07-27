import { Decimal } from "@prisma/client/runtime/library";

export const products = [
  {
    name: "FULL FIBER VOLUME SHAMPOO FOR THIN HAIR",
    description:
      "Add bounce and volume to flat hair with this salon-quality, hair volume shampoo formula. TRESemmé Full Fiber Volume Shampoo, infused with collagen technology, provides instant lift and body to flat hair, leaving your tresses full of bounce and vitality.",
    categoryId: 1,
    price: new Decimal(15.99),
    image:
      "product_1",
    quantity: 50,
  },
  {
    name: "PURPLE CONDITIONER FOR BLONDE HAIR",
    description:
      "Calling all blondes! Keep extra cool with TRESemmé Purple Blonde Shampoo. Powered by Ultra-Violet Neutralizer™ technology, this professional-quality toning system formulated for blonde and silver hair transforms brassy undertones and brightens dull hues. Hydrates and softens all shades of blonde. Free from Parabens and DMDM Hydantoin.",
    categoryId: 2,
    price: new Decimal(12.99),
    image:
      "product_2",
    quantity: 100,
  },
  {
    name: "EXTRA HOLD HAIR GEL FOR FRIZZ CONTROL",
    description:
      "All-day frizz control never looked so good! TRESemmé Extra Hold Hair Gel, now in a tub, provides extra-firm control to hold your style in place without the sticky-wet look.",
    categoryId: 3,
    price: new Decimal(9.99),
    image:
      "product_3",
    quantity: 30,
  },
  {
    name: "TRESEMMÉ KERATIN SMOOTH WEIGHTLESS PERFECTING LEAVE IN LOTION",
    description:
      "Seal up those split ends! Our Perfecting Leave-In Lotion’s nourishing formula allows you to style and visibly repair your hair by sealing up to 88% of split ends with no weigh down. Our line of Keratin Smooth Weightless products is specially designed to fight frizz, boost smoothness and shine, and add silky softness. Nourish your strands, tame those pesky flyaways, and protect against breakage with this conditioning formula.",
    categoryId: 4,
    price: new Decimal(7.99),
    image:
      "product_4",
    quantity: 20,
  },
  {
    name: "Wahl 5 Star Cordless Black Magic Clip",
    description:
      "Wahl took what professionals love about the original Cordless Magic Clip and made it even better. With a more powerful motor and upgraded blades, the 5 Star Black Cordless Magic Clip is the update Barbers and Stylists have been waiting for.",
    categoryId: 5,
    price: new Decimal(149.99),
    image:
      "product_5",
    quantity: 75,
  },
  {
    name: "StarMaxx Single Edge Razor Blade",
    description:
      "Superior Platinum XXTRA Coating Singe Edge Razor Blades. 100 Single Edge Blades",
    categoryId: 6,
    price: new Decimal(4.99),
    image:
      "product_6",
    quantity: 64,
  },
  {
    name: "Pebco ProTools Barber Shear 7″",
    description:
      "Pebco ProTools Barbering Shears are made from Premium Japanese Steel, offering Barbers the precision, speed, and sharpness they need to be a master of their craft. Our range of tools was designed purposefully for barbering mastery. Offering just the right amount of precision and weight to effortlessly cut, style, and balance a haircut.",
    categoryId: 7,
    price: new Decimal(59.99),
    image:
      "product_7",
    quantity: 51,
  },
];
