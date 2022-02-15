import React, { useState, useEffect } from "react";
import Auth from "../utils/auth";
import { useMutation, useQuery } from "@apollo/client";
import {
  UPDATE_BID,
  SAVE_FLIGHT,
  DELETE_FLIGHT,
  UPDATE_LATESTBID_USER,
  UPDATE_BID_HISTORY,
} from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";

function AuctionButton(props) {
  const watch = require("../../src/assets/icons/watch.png");
  const watchHover = require("../../src/assets/icons/watch2.png");
  const pathArray = window.location.pathname.split("/");
  const auctionId = pathArray[pathArray.length - 1];
  const { loading, data } = useQuery(QUERY_ME);
  const userData = data?.me || {};

  console.log("111", props.auctionData.currentBid)

  const [bid, setBid] = useState("");
  // const [history, setHistory] =useState([props.auctionData.bidsHistory])

  // console.log("111", history)
  const [updateBid, { error }] = useMutation(UPDATE_BID);
  const [saveflight] = useMutation(SAVE_FLIGHT);
  const [deleteflight] = useMutation(DELETE_FLIGHT);
  const [updateLatestBidUser] = useMutation(UPDATE_LATESTBID_USER);
  const [updateBidHistory] = useMutation(UPDATE_BID_HISTORY);

  const handleInputChange = (e) => {
    // Getting the value and name of the input which triggered the change
    const { target } = e;
    // const inputType = target.name;
    const inputValue = target.value;
    setBid(inputValue);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!+bid) {
        console.log("Not a number");
        setBid("");
        throw new Error("Not a number!");
      } else if (+bid <= props.auctionData.currentBid) {
        console.log("You cant bid lower");
        throw new Error("You cant bid lower!");
      } else {
        await updateBid({
          variables: { currentBid: +bid, _id: auctionId },
        });

        await deleteflight({
          variables: {
            auctionId: auctionId,
            remuserId: props.auctionData.latestBidUser._id,
          },
        });
        await updateLatestBidUser({
          variables: { _id: auctionId },
        });
        await saveflight({
          variables: { _id: auctionId },
        });

        await updateBidHistory({
          variables: { auctionId: auctionId, bidAmount: +bid },
        });
      }
      // if (!response) {
      //   throw new Error("something went wrong!");
      // }
    } catch (error) {
      console.error(error);
    }
    setBid("");
  };

  if (Auth.loggedIn() && props.auctionData.auctionEndDate > new Date()) {
    return (
      <>
        <div className="watchOption">
          <a href="/watchlist">
            <img
              id="watchIcon"
              className="icon default"
              alt="watch"
              src={watch}
            />
            <img
              id="watchIcon2"
              className="icon hover"
              alt="watch hover"
              src={watchHover}
            />
          </a>
          <h2>Watch this Auction </h2>
        </div>
        <div className="enterBid">
          <input
            id="enterBid"
            placeholder="enter your bid"
            value={bid}
            name="number"
            onChange={handleInputChange}
          />
          <button
            className="shadow-pop-br"
            id="submitBtn"
            type="submit"
            onClick={handleFormSubmit}
          >
            <h1>PLACE BID</h1>
          </button>
        </div>
        {error ? (
          <div>
            <p className="error-text" style={{ color: "red" }}>
              BID ERROR
            </p>
          </div>
        ) : null}
      </>
    );
  } else if (
    Auth.loggedIn() &&
    props.auctionData.auctionEndDate < new Date() &&
    userData._id === props.auctionData.latestBidUser._id
  ) {
    return (
      <div className="enterBid btnTerms">
        <h2 className="auctionMessage">YOU WIN!</h2>
        <a
          className="shadow-pop-br"
          id="submitBtn"
          type="submit"
          href="/payment"
        >
          <h1>MAKE PAYMENT</h1>
        </a>
      </div>
    );
  } else if (!Auth.loggedIn()) {
    return (
      <div className="enterBid">
        <a className="shadow-pop-br" id="submitBtn" type="submit" href="/login">
          <h1>LOGIN TO BID</h1>
        </a>
      </div>
    );
  } else {
    return (
      <div className="enterBid">
        <h2 className="auctionMessage">AUCTION IS CLOSED</h2>
        {error ? (
          <div>
            <p className="error-text" style={{ color: "red" }}>
              BID ERROR
            </p>
          </div>
        ) : null}
      </div>
    );
  }
}
export default AuctionButton;
