import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const inappropriateWords = [
  "asshole","assh0le", "assh01e","assho1e", "a55hole", "a55h0le", "a55h01e",
  "a55ho1e", "ba5tard", "b1tch", "bullsh1t", "bu11shit", "bu11sh1t", "bu1lsh1t",
  "d1ck", "d0uche", "m0therfucker", "vigger", "nigga", "n1gger", "ni99er", "ni9ger",
  "nig9er", "n199er", "n1g9er", "n19ger", "p1ss", "p155", "p15s", "p1s5", "pi55", "pi5s",
  "pis5", "pr1ck", "pu5sy", "pu55y", "pus5y", "pus5", "pu55", "pu5s", "sh1t", "s1ut",
  "wh0re", "bastard", "bitch", "bullshit", "cunt", "cum", "cummer", "cun7",
  "damn", "dick", "douche", "fuck", "fucker", "motherfucker", "nigger", "piss", 
  "prick", "puss", "pussy","retard", "shit", "slut", "twat", "whore", "wanker", "jerker",
  "faggot", "fagg0t", "fag", "queer",  "dyke", "killyourself", 
  "k1llyourself", "k1lly0urself", "k1lly0urse1f", "killy0urself", "killy0urse1f", "k1llyourse1f",
  "a5shole", "a5sh0le", "a5sh01e", "a5sho1e", "4sshole", "4ssh0le", "4ssh01e", "4ssho1e",
  "blowjob", "b10wjob", "bl0wjob", "bl0wj0b", "b10wj0b", "blowj0b", "bl0wj0b",
  "cocksucker", "c0cksucker", "c0cksuck3r", "c0cksuckr", "c0cksuck", "cocksuck3r", "c0cksucker",
  "c0cksuck", "f4ggot", "f4g", "qu33r", "d1ckhead", "d1ckh3ad", "d1ckhed", "dickhead", "dickh3ad", 
  "dickhed", "jackass", "jack@ss", "j@ckass", "j@ck@ss", "jerkoff", "jerk0ff", "j3rkoff", "j3rk0ff", 
  "masturbate", "m@sturbate", "m@stur8", "m@sturb8", "masturb8", "mastur8", "motherfucker", 
  "moth3rfucker", "m0therfucker", "m0th3rfucker", "phuck", "phucker", "phuk", "p00p", "p0rn", 
  "porn", "pr0n", "rap3", "r@pe", "r@p3", "suck", "sh1thead", "sh1th3ad", "sh1thad", "shithe@d", 
  "shith3ad", "shithad", "t1t", "t1ts", "tit", "tits", "vagina", "vaj1na", "vajina", "vag1na", 
  "vajayjay", "va-jay-jay", "vaj@yjay", "wh0r3", "whore", "wh0r", "whor", "wank3r", "wank", 
  "w4nk", "wanker", "w4nker"
];

const MakeGuild = ({ UserData, setUserData }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [GuildMade, setGuildMade] = useState(false);
  const [Threeguilds, setThreeguilds] = useState(false);
  const [formData, setFormData] = useState({
    guildName: "",
    guildMoto: "",
    bio: "",
    guildColor: "blue",
    RequestToJoin: false,
    Findable: true,
  });

  useEffect(() => {
    if (UserData.guildsOwned.length === 3) {
      setThreeguilds(true)
    }
  }, []);

  const handleChange = (e) => {
    const { name, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : e.target.value;
    const finalValue = newValue === 'true' ? true : newValue === 'false' ? false : newValue;
    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const containsInappropriateWords = inappropriateWords.some(word => 
      Object.values(formData).some(input => String(input).toLowerCase().includes(word))
    );
  
    if (containsInappropriateWords) {
      setErrorMessage(' An Input contains inappropriate content');
      return;
    }
    if (UserData.guildsOwned.length === 3) {
      setErrorMessage('Sorry you already own 3 Guilds')
      return
    }
    
    try {
      const response = await fetch(`http://localhost:5000/Guilds/${UserData.id || UserData._id}/Make-Guild`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
  
      const data = await response.json(); 
      setUserData(data.user);
      setGuildMade(true)
    } catch (error) {
      console.error('Error creating guild:', error.message);
      setErrorMessage(`${error.message}`)
    }
  };

  return (
    <div className="Guild-reg-main-div">
      <h1 style={{ paddingTop: '108px' }}>What Is A Guild</h1>
      <p className="make-guild-p" style={{ width: '80%', textAlign: 'center' }}>
        A guild is a place you and others around the world can join together to
        communicate and share the stories of your travels. Upon making a guild, you become the "Guild Master" responsible for your cohorts and your community.
        You have the power to shape your guild however you choose. 
        <br/>
        <br/>
        You can only be a "Guild Master" of up to 3 guilds.
      </p>
      {Threeguilds && (
        <div>
          <br/>
          <br/>
          <br/>
          <h1>You Already Own Three Guilds</h1>
        </div>
      )}
      {!Threeguilds && !GuildMade && (
      <div>
        <h1 style={{ textAlign: 'center' }}>Guild Registry</h1>
        <form onSubmit={handleSubmit} className="Guild-form">
          <h2 style={{color: 'red'}}>{errorMessage}</h2>

          <label htmlFor="guildName">Guild Name:</label>
          <input
            style={{ textAlign: 'center', width: '40%' }}
            maxLength={22}
            className="Guild-inputs"
            type="text"
            id="guildName"
            name="guildName"
            value={formData.guildName}
            onChange={handleChange}
            required
          />

          <label htmlFor="guildMoto">Guild Moto "What Is Your Guilds Purpose": 50 char. max</label>
          <input
            maxLength={45}
            className="Guild-inputs"
            type="text"
            id="guildMoto"
            name="guildMoto"
            value={formData.guildMoto}
            onChange={handleChange}
            required
          />

          <label htmlFor="bio">Bio:</label>
          <textarea
            style={{ width: '210px', height: '100px', resize: 'none' }}
            id="bio"
            name="bio"
            maxLength={165}
            value={formData.bio}
            onChange={handleChange}
            required
          ></textarea>

          <label htmlFor="guildColor">Guild Color:</label>
          <select
            id="guildColor"
            name="guildColor"
            value={formData.guildColor}
            onChange={handleChange}
          >
            <option value="blue">Blue</option>
            <option value="red">Red</option>
            <option value="orange">Orange</option>
            <option value="yellow">Yellow</option>
            <option value="grey">Grey</option>
            <option value="purple">Purple</option>
            <option value="green">Green</option>
          </select>

          <label htmlFor="RequestToJoin">Send Request To Join:</label>
          <input
          type="checkbox"
            id="RequestToJoin"
            name="RequestToJoin"
            value={formData.RequestToJoin}
            onChange={handleChange}
          />

          <label htmlFor="Findable">Findable:</label>
          <input
            type="checkbox"
            id="Findable"
            name="Findable"
            checked={formData.Findable}
            onChange={handleChange}
          />

          <button className="Make-guild-btn" type="submit">Create Guild</button>
        </form>
      </div>
      )}
      {GuildMade && (
        <div>
          <h1>{formData.guildName} Has Been Made</h1>
          <br/>
          <br/>
          <br/>
          <Link to="/All-Guilds"><h3 style={{textAlign: 'center', cursor: 'pointer'}}> Go To Guild Page </h3> </Link>
        </div>
      )}
    </div>
  )
}

export default MakeGuild;