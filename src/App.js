
import { useState, useEffect } from 'react'
import axios from 'axios';

const URL = 'http://localhost/shopping-list/';

function App() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  // const [description, setDescription] = useState('')
  const [amount, setAmount] = useState(0)
  const [editItem, setEditItem] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState(0)

  useEffect(() => {
    axios.get(URL + 'index.php')
      .then((response) => {
        
        setItems
          (response.data)
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      })
  }, [])

  function add(e) {
    e.preventDefault();
    const json = JSON.stringify({description : item, amount : amount})
    axios.post(URL + 'save.php', json, {
      headers: {
        'Content-Type': 'application/json'
      }
      
    })
      .then((response) => {
        setItems
          (items => [...items, response.data]);
        setItem('')
        setAmount('');
      }).catch(error => {
        alert(error.response.data.error)
      })
  }

  function remove(id) {
    const json = JSON.stringify({ id: id })
    axios.post(URL + 'delete.php', json, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        const newListWithoutRemoved = items.filter((item) => item.id !== id);
        setItems(newListWithoutRemoved)
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      })
  }

  function setEditedItem(item) {
    setEditItem(item);
    setEditDescription(item?.description)
    setEditAmount(item?.amount);
  }

  function update(e) {
    e.preventDefault();
    const json = JSON.stringify({ id: editItem.id, description: editDescription, amount: editAmount })
    axios.post(URL + 'update.php', json, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        items[(items.findIndex(item => item.id === editItem.id))].description = editDescription;
        items[(items.findIndex(item => item.id === editItem.id))].amount = editAmount;
        setItems
          ([...items]);
        setEditedItem(null);
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      })
  }


  return (
    <div className="container">
      <h3>Shopping list</h3>
      <form onSubmit={add}>
        <label>New item</label>
        <input value={item} placeholder="type product" onChange={e => setItem(e.target.value)} />
        <input value={amount} placeholder = "type amount" onChange={e => setAmount(e.target.value)} />
        <button>Save</button>
      </form>
      <ol>
        {items?.map(item => (
          <li key={item.id}>
            <span className ="desc">{item.description}</span>
            <span className ="amount">{item.amount} pieces</span>
            <button className="delete" onClick={() => remove(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;

  {/* {editItem?.id !== item.id &&
              item.description
            }
            {editItem?.id !== item.id &&
              item.amount
            }
            {editItem?.id === item.id &&
              <form onSubmit={update}>
                <input value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                <input value={editAmount} onChange={e => setEditAmount(e.target.value)} />
                <button>Add</button>
                <button type="button" onClick={() => setEditedItem(null)}>Cancel</button>
              </form>
            }
            <a href="#" className="delete" onClick={() => remove(item.id)}>
              Delete
            </a>&nbsp;
            {editItem === null &&
              <a className="edit" onClick={() => setEditedItem(item)} href="#">
                Edit
              </a>
            } */}

            