import { Decimal } from "@prisma/client/runtime/library";

export const products = [
  {
    name: "FULL FIBER VOLUME SHAMPOO FOR THIN HAIR",
    description:
      "Add bounce and volume to flat hair with this salon-quality, hair volume shampoo formula. TRESemmé Full Fiber Volume Shampoo, infused with collagen technology, provides instant lift and body to flat hair, leaving your tresses full of bounce and vitality.",
    categoryId: 1,
    price: new Decimal(15.99),
    image:
      "https://cdn.sanity.io/images/4nopozul/tresemme-staging-us/ff3f77abfc3bfd5c85395ebf13e146e0d6352b0b-600x600.jpg?w=450&h=450&fit=fill&auto=format&q=80&bg=fff",
    quantity: 50,
  },
  {
    name: "PURPLE CONDITIONER FOR BLONDE HAIR",
    description:
      "Calling all blondes! Keep extra cool with TRESemmé Purple Blonde Shampoo. Powered by Ultra-Violet Neutralizer™ technology, this professional-quality toning system formulated for blonde and silver hair transforms brassy undertones and brightens dull hues. Hydrates and softens all shades of blonde. Free from Parabens and DMDM Hydantoin.",
    categoryId: 2,
    price: new Decimal(12.99),
    image:
      "https://cdn.sanity.io/images/4nopozul/tresemme-staging-us/c7309c9683b046f5644e70ef12397472a22ff665-1200x1200.jpg?w=450&h=450&fit=fill&auto=format&q=80&bg=fff",
    quantity: 100,
  },
  {
    name: "EXTRA HOLD HAIR GEL FOR FRIZZ CONTROL",
    description:
      "All-day frizz control never looked so good! TRESemmé Extra Hold Hair Gel, now in a tub, provides extra-firm control to hold your style in place without the sticky-wet look.",
    categoryId: 3,
    price: new Decimal(9.99),
    image:
      "https://cdn.sanity.io/images/4nopozul/tresemme-staging-us/e7959c57f282052639f6cae20a0e84d31f60e5c6-2880x2880.png?w=450&h=450&fit=fill&auto=format&q=80&bg=fff",
    quantity: 30,
  },
  {
    name: "TRESEMMÉ KERATIN SMOOTH WEIGHTLESS PERFECTING LEAVE IN LOTION",
    description:
      "Seal up those split ends! Our Perfecting Leave-In Lotion’s nourishing formula allows you to style and visibly repair your hair by sealing up to 88% of split ends with no weigh down. Our line of Keratin Smooth Weightless products is specially designed to fight frizz, boost smoothness and shine, and add silky softness. Nourish your strands, tame those pesky flyaways, and protect against breakage with this conditioning formula.",
    categoryId: 4,
    price: new Decimal(7.99),
    image:
      "https://cdn.sanity.io/images/4nopozul/tresemme-staging-us/10553cc05c0742fe43a2129e076fe4bf2bbcfa63-5000x5000.jpg?w=450&h=450&fit=fill&auto=format&q=80&bg=fff",
    quantity: 20,
  },
  {
    name: "Wahl 5 Star Cordless Black Magic Clip",
    description:
      "Wahl took what professionals love about the original Cordless Magic Clip and made it even better. With a more powerful motor and upgraded blades, the 5 Star Black Cordless Magic Clip is the update Barbers and Stylists have been waiting for.",
    categoryId: 5,
    price: new Decimal(149.99),
    image:
      "https://www.barberdepots.com/wp-content/uploads/2024/04/wahl-5-star-black-cordless-magic-clip-3026432.webp",
    quantity: 75,
  },
  {
    name: "StarMaxx Single Edge Razor Blade",
    description:
      "Superior Platinum XXTRA Coating Singe Edge Razor Blades. 100 Single Edge Blades",
    categoryId: 6,
    price: new Decimal(4.99),
    image:
      "https://www.barberdepots.com/wp-content/uploads/2024/06/starmaxx-single-edge-razor-blade-smp200-100.png",
    quantity: 64,
  },
  {
    name: "Pebco ProTools Barber Shear 7″",
    description:
      "Pebco ProTools Barbering Shears are made from Premium Japanese Steel, offering Barbers the precision, speed, and sharpness they need to be a master of their craft. Our range of tools was designed purposefully for barbering mastery. Offering just the right amount of precision and weight to effortlessly cut, style, and balance a haircut.",
    categoryId: 7,
    price: new Decimal(59.99),
    image:
      "https://www.barberdepots.com/wp-content/uploads/2022/11/pebco-barber-shear-7-pt-1076.jpg",
    quantity: 51,
  },
];
