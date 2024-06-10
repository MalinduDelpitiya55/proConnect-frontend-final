// src/components/MyGigs/MyGigs.jsx

import React, {useState} from "react";
import {Link} from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function MyGigs() {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  const user = localStorage.getItem("currentUser");
  const userObject = JSON.parse(user);
  const [editGig, setEditGig] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const {isLoading, error, data} = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      newRequest.get(`/gigs?userId=${currentUser._id}`).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => newRequest.delete(`/gigs/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["myGigs"]),
  });

  const updateMutation = useMutation({
    
    mutationFn: (updatedGig) => {
      console.log(userObject._id);
      console.log(updatedGig);
       newRequest.post(`/gigs/updategig/${updatedGig._id}`, {
         userID: userObject._id,
         gig: updatedGig,
       });
      
     },
     onSuccess: () => {queryClient.invalidateQueries(["myGigs"])},
     onError: (error) => {
       console.error("Error updating gig:", error);
     },
   });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (gig) => {
    setEditGig(gig._id);
    setNewTitle(gig.title);
  };

  const handleSave = (id) => {
    updateMutation.mutate({_id: id, title: newTitle});
    setEditGig(null);
  };

  return (
    <div className="myGigs">
      {isLoading ? (
        "Loading..."
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <div className="container">
          <div className="title">
            <h1>Gigs</h1>
            {currentUser.isSeller && (
              <Link to="/add">
                <button>Add New Gig</button>
              </Link>
            )}
          </div>
          {data.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Sales</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((gig) => (
                  <tr key={gig._id}>
                    <td>
                      <img className="image" src={gig.cover} alt={gig.title} />
                    </td>
                    <td>
                      {editGig === gig._id ? (
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                        />
                      ) : (
                        gig.title
                      )}
                    </td>
                    <td>{gig.price}</td>
                    <td>{gig.sales}</td>
                    <td>
                      {editGig === gig._id ? (
                        <button onClick={() => handleSave(gig._id)}>
                          Save
                        </button>
                      ) : (
                        <button onClick={() => handleEdit(gig)}>Edit</button>
                      )}
                      <img
                        className="delete"
                        src="./img/delete.png"
                        alt="Delete"
                        onClick={() => handleDelete(gig._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No gigs found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MyGigs;
