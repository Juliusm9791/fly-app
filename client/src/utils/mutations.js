import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      token
      user {
        _id
      }
    }
  }
`;

export const UPDATE_BID = gql`
mutation updateBid($_id: ID!, $currentBid: Float!) {
  updateBid(_id: $_id, currentBid: $currentBid){
    currentBid
    _id
   }
  }
`
export const SAVE_FLIGHT = gql`
  mutation saveflight($_id: ID!) {
       saveflight(auctions: $_id) {
          auctions{
            _id
        }
      }
    }
`;

export const ADD_ORDER = gql`
  mutation addOrder($products: [ID]!) {
    addOrder(products: $products) {
      purchaseDate
      products {
        _id
        name
        description
        price
        quantity
        category {
          name
        }
      }
    }
  }
`;