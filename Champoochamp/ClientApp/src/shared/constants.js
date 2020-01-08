const port = {
  apiPort: 'http://localhost:4000',
  prophetPort: 'http://localhost:3000',
  ghtkPort: 'http://localhost:2000',
}

const adminPage = {
  invoicePage: 'invoicePage',
  discountPage: 'discountPage',
  productPage: 'productPage',
  categoryPage: 'categoryPage',
  collectionPage: 'collectionPage',
  colorPage: 'colorPage',
  sizePage: 'sizePage',
  brandPage: 'brandPage',
  unitPage: 'unitPage',  
  suplierPage: 'suplierPage',
  userPage: 'userPage',
  employeePage: 'employeePage',
  prophetPage: 'prophetPage'
}

const localStorageKey = {
  storageShoppingCartKey: 'MyShoppingCart',
  timeUserSessionKey: 'ChampoochampTimeUserSession',
  timeEmployeeSessionKey: 'ChampoochampTimeEmployeeSession',
  userKey: 'ChampoochampUser',
  employeeKey: 'ChampoochampEmployee',
  emailKey: 'ChampoochampEmail',
  passwordKey: 'ChampoochampPassword',
  userNameAdminKey: 'ChampoochampUserNameAdmin',
  passwordAdminKey: 'ChampoochampPasswordAdmin'
}

const champoochampInfo = {
  name: 'Champoochamp',
  email: 'champoochamp@gmail.com',
  province: 'Thành phố Hồ Chí Minh',
  district: 'Quận 1',
  address: 'Hẻm 19, số 74',
  phone: '0937777999',
}

const ghtk = {
  token: '1eaf5cdc13036460fe42259b4C58eBDcF3855A38',
  apiTransportFee: '/ghtk/getShipmentFee.php',
  apiOrder: '/ghtk/order.php',
}


const filtersGroup = {
  brand: 'Thương hiệu',
  size: 'Kích cỡ',
  color: 'Màu sắc',
  money: 'Giá'
};

const imagesGroup = {
  banners: 'banners',
  products: 'products',
  users: 'users',
  collections: 'collections',
  logos: 'logos'
};

const time = {
  newProductPeriod: 30,
  durationNotification: 3,
  expiresDayOfSession: 0.5,
  expiresDayOfCookie: 1,
}

const paymentMethod = {
  cod: 'COD',
  banking: 'Banking'
};

const productQuantity = {
  min: 1,
  max: 99
};

const searchGroup = {
  category: 'Loại sản phẩm',
  product: 'Sản phẩm'
};

const sortsGroup = [
  {
    id: 0,
    name: 'Nổi bật nhất'
  },
  {
    id: 1,
    name: 'Mới nhất'
  },
  {
    id: 2,
    name: 'Giá tăng dần'
  },
  {
    id: 3,
    name: 'Giá giảm dần'
  }
];

const topProductsName = {
  discountProducts: 'Khuyến mãi hot',
  newProducts: 'Sản phẩm mới',
  relatedProducts: 'Sản phẩm liên quan'
};

const typeForm = {
  create: 'create',
  update: 'update'
};

const viewportWidth = {
  sm: 575,
  md: 767,
  lg: 991,
  xl: 1200
};

export {
  adminPage,
  champoochampInfo,
  filtersGroup,
  ghtk,
  imagesGroup,
  localStorageKey,
  paymentMethod,
  port,
  productQuantity,
  searchGroup,
  sortsGroup,
  time,
  topProductsName,
  typeForm,
  viewportWidth
};
