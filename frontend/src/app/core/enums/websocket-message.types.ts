export enum WebsocketMessageTypes {
  COMMENT_EVENT = 'commentEvent',
  RESTAURANT_NEW_EVENT = 'newRestaurantEvent',
  RESTAURANT_DELETED_EVENT = 'deleteRestaurantEvent',
  ORDER_ITEM_EVENT = 'orderItemEvent',
  ORDER_ITEM_DELETE_EVENT = 'orderItemDeleteEvent',
  ORDER_ITEM_USER_EVENT = 'orderItemUserEvent',
  ORDER_ITEM_USER_DELETE_EVENT = 'deleteOrderItemUserEvent',
  ORDER_NEW_EVENT = 'orderNewEvent',
}
