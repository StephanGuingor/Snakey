import axios from "axios";

import store from "@/store/index"

export default {
    getScores() : void {
        // GET request for remote image in node.js
        axios({
            method: 'get',

            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            url: `http://localhost:5000/scores?name=${store.state.name}`,
            responseType: 'json'
        })
            .then(function (response) {
                if (response.status === 200 && response.data.scores !== null) {
                    store.commit("setScores",response.data.scores.map((v : any) => v.points ))
                } else {
                    store.commit("setScores",[])
                }

               //return response.data;

            });
    },

    addScore(score : number ) : void {
        // GET request for remote image in node.js
        const data = { "username" : store.state.name, "points" : score}
        axios.post('http://localhost:5000/scores',data);
    }
}