import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import web3 from './web3';
import TicketContract from './ticket';

function App() {
  const [account, setAccount] = useState('');
  const [ticketIdInput, setTicketIdInput] = useState('');
  const [swapTicketIdInput, setSwapTicketIdInput] = useState('');
  const [acceptTicketIdInput, setAcceptTicketIdInput] = useState('');
  const [availableTickets, setAvailableTickets] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const accounts = await web3.eth.getAccounts();
        const availableTicketsCount = await TicketContract.methods.getAvailableTickets().call();

        setAccount(accounts[0]);
        setAvailableTickets(parseInt(availableTicketsCount));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    loadData();
  }, []);

  const purchaseTicket = async () => {
    try {
      await TicketContract.methods.buyTicket(ticketIdInput).send({ from: account, value: TicketContract.methods.ticketPrice().call() });
      alert('Ticket purchased successfully!');
      setAvailableTickets((prevCount) => prevCount - 1); // Update available tickets count
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      alert('Error purchasing ticket');
    }
  };

  const offerSwap = async () => {
    try {
      await TicketContract.methods.offerSwap().send({ from: account });
      alert('Swap offer sent successfully!');
    } catch (error) {
      console.error('Error offering swap:', error);
      alert('Error offering swap');
    }
  };

  const acceptOffer = async () => {
    try {
      await TicketContract.methods.acceptSwap(acceptTicketIdInput).send({ from: account });
      alert('Swap accepted successfully!');
    } catch (error) {
      console.error('Error accepting swap:', error);
      alert('Error accepting swap');
    }
  };

  const returnTicket = async () => {
    try {
      await TicketContract.methods.returnTicket(ticketIdInput).send({ from: account });
      alert('Ticket returned successfully!');
      setAvailableTickets((prevCount) => prevCount + 1); // Update available tickets count
    } catch (error) {
      console.error('Error returning ticket:', error);
      alert('Error returning ticket');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="ticket-container">
          <div className="available-tickets">
            <h2>Available Tickets: {availableTickets}</h2>
          </div>

          <div className="ticket-action">
            <h2>Purchase Ticket</h2>
            <input
              type="text"
              placeholder="Enter Ticket Number"
              value={ticketIdInput}
              onChange={(e) => setTicketIdInput(e.target.value)}
            />
            <button onClick={purchaseTicket}>Purchase</button>
          </div>

          <div className="ticket-action">
            <h2>Offer Swap</h2>
            <input
              type="text"
              placeholder="Enter Ticket Number to Swap"
              value={swapTicketIdInput}
              onChange={(e) => setSwapTicketIdInput(e.target.value)}
            />
            <button onClick={offerSwap}>Offer Swap</button>
          </div>

          <div className="ticket-action">
            <h2>Accept Offer</h2>
            <input
              type="text"
              placeholder="Enter Ticket Number to Accept"
              value={acceptTicketIdInput}
              onChange={(e) => setAcceptTicketIdInput(e.target.value)}
            />
            <button onClick={acceptOffer}>Accept Offer</button>
          </div>

          <div className="ticket-action">
            <h2>Return Ticket</h2>
            <input
              type="text"
              placeholder="Enter Ticket Number"
              value={ticketIdInput}
              onChange={(e) => setTicketIdInput(e.target.value)}
            />
            <button onClick={returnTicket}>Return Ticket</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
