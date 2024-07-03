import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import reloadicon from './icons/sync.png'
import Likeicon from './icons/heart.png'
import likedicon from './icons/love.png'
import dislikeicon from './icons/dont-like-symbol.png'
import dislikedicon from './icons/dislike.png'
import commenticon from './icons/commentary.png'

//MAKE REFRESH ONLY REFRESH THE USERS AND NOT EMIT TO ALL!!!!!!

const GuildPages = ({UserData, setUserData, clickedGuild, setclickedGuild}) => {
  const [socket, setSocket] = useState(null);
  const topMainFeedRef = useRef(null);
  const [AllMembers, setAllMembers] = useState(null);
  const [RequestedMembers, setRequestedMembers] = useState(null);
  const [clickedMember, setclickedMember] = useState(null);
  const [AlertsArray, setAlertsArray] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [PostsArray, setPostsArray] = useState(null);
  const [posts, setPosts] = useState([]);
  const [GuildRequestCount, setGuildRequestCount] = useState('0')
  const [ShowGuildStats, setShowGuildStats] = useState(false);
  const [ShowGuildJoinRequest, setShowGuildJoinRequest] = useState(false);
  const [ShowBanReasonInput, setShowBanReasonInput] = useState(false);
  const [ShowGuildGuidelines, setShowGuildGuidelines] = useState(false)
  const [ShowGuildGuidelines2, setShowGuildGuidelines2] = useState(false)
  const [BaninputValue, setBanInputValue] = useState('');
  const [ReportinputValue, setReportInputValue] = useState('');
  const [CommentinputValue, setCommentInputValue] = useState('');
  const [GuidelinesinputValue, setGuidelinesinputValue] = useState('');
  const [AlertinputValue, setAlertinputValue] = useState('');
  const [PostinputValue, setPostinputValue] = useState('');
  const [ShowGuildSettings, setShowGuildSettings] = useState(false)
  const [ShowChangeGuildFeatures, setShowChangeGuildFeatures] = useState(false)
  const [ShowEditGuildFeatures, setShowEditGuildFeatures] = useState(false)
  const [ShowGuildReportUser, setShowGuildReportUser] = useState(false);
  const [ShowGuildReportList, setShowGuildReportList] = useState(false)
  const [clickedMemberForReport, setclickedMemberForReport] = useState(null);
  const [ShowGuildWarningUser, setShowGuildWarningUser] = useState(false);
  const [WarninginputValue, setWarningInputValue] = useState('');
  const [clickedMemberForWarning, setclickedMemberForWarning] = useState(null);
  const [currentlyclickedelder, setcurrentlyclickedelder] = useState(null);
  const [ShowWarnings, setShowWarnings] = useState(false);
  const [ShowBannedTravelers, setShowBannedTravelers] = useState(false);
  const [ShowFinalLeave, setShowFinalLeave] = useState(false);
  const [ShowReportGuild, setShowReportGuild] = useState(false);
  const [ShowElderMessages, setShowElderMessages] = useState(false);
  const [ShowDisbandWarning,setShowDisbandWarning] = useState(false);
  const [CommentClicked, setCommentClicked] = useState(null); 
  const [MainFeedClicked, setMainFeedClicked] = useState(true);
  const [GuildAlertsClicked, setGuildAlertsClicked] = useState(false); 
  const [YourPostClicked, setYourPostClicked] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [MakeAlertClicked, setMakeAlertClicked] = useState(false);
  const [MakePostClicked, setMakePostClicked] = useState(false);
  const [NewPost, setNewPost] = useState(false);
  const [guildData, setGuildData] = useState({
    guildMoto: clickedGuild.guildMoto,
    bio: clickedGuild.bio,
    RequestToJoin: clickedGuild.RequestToJoin,
    Findable: clickedGuild.Findable,
    guildColor: clickedGuild.guildColor,
  });
  const containerRef = useRef(null);
  const [reportData, setReportData] = useState({
    GuildName: '',
    ReasonForReport: '',
    ReportDetails: ''
  });

  const inappropriateWords = [
    "m0therfucker", "vigger", "nigga", "n1gger", "ni99er", "ni9ger",
    "nig9er", "n199er", "n1g9er", "n19ger", "pu5sy", "pu55y", "pus5y", "pus5", "pu55", "pu5s", "s1ut",
    "wh0re", "bitch", "cunt", "cum", "cummer", "cun7",
    "dick", "douche", "fuck", "fucker", "motherfucker", "nigger", 
    "puss", "pussy","retard", "shit", "slut", "twat", "whore", "wanker", "jerker",
    "faggot", "fagg0t", "fag", "queer",  "dyke", "killyourself", 
    "k1llyourself", "k1lly0urself", "k1lly0urse1f", "killy0urself", "killy0urse1f", "k1llyourse1f",
    "blowjob", "b10wjob", "bl0wjob", "bl0wj0b", "b10wj0b", "blowj0b", "bl0wj0b",
    "cocksucker", "c0cksucker", "c0cksuck3r", "c0cksuckr", "c0cksuck", "cocksuck3r", "c0cksucker",
    "c0cksuck", "f4ggot", "f4g", "qu33r", "d1ckhead", "d1ckh3ad", "d1ckhed", "dickhead", "dickh3ad", 
    "dickhed", "jackass", "jack@ss", "j@ckass", "j@ck@ss", "jerkoff", "jerk0ff", "j3rkoff", "j3rk0ff", 
    "masturbate", "m@sturbate", "m@stur8", "m@sturb8", "masturb8", "mastur8", "motherfucker", 
    "moth3rfucker", "m0therfucker", "m0th3rfucker", "phuck", "phucker", "phuk", "p0rn", 
    "porn", "pr0n", "rap3", "r@pe", "r@p3", "suck", "sh1thead", "sh1th3ad", "sh1thad", "shithe@d", 
    "shith3ad", "shithad", "t1t", "t1ts", "tit", "tits", "vagina", "vaj1na", "vajina", "vag1na", 
    "vajayjay", "va-jay-jay", "vaj@yjay", "wh0r3", "whore", "wh0r", "whor", "wank3r", "wank", 
    "w4nk", "wanker", "w4nker"
  ];

  const handleReportChange = (e) => {
    setReportData({ ...reportData, [e.target.name]: e.target.value });
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/Reports/guild/${UserData.id || UserData._id}/${clickedGuild.id || clickedGuild._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
      });

      const data = await response.json();
      if (response.ok) {
        alert('Guild report submitted successfully!');
        setShowReportGuild(false)
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error submitting guild report:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGuildData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();

  // Check for inappropriate words
  const containsInappropriateWords = inappropriateWords.some(word => 
    Object.values(guildData).some(input => String(input).toLowerCase().includes(word))
  );

  if (containsInappropriateWords) {
    alert('Input contains inappropriate content');
    return;
  }

  const guildId = clickedGuild.id || clickedGuild._id; // Assuming guild ID is stored in clickedGuild._id
  try {
    const response = await fetch(`http://localhost:5000/Guilds/id/${guildId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guildData),
    });

    if (!response.ok) {
      throw new Error('Failed to update guild');
    }

    const updatedGuild = await response.json();
    console.log('Updated Guild:', updatedGuild);
    if (socket) {
      socket.emit('update-all-guild', guildId);
    }

    handleChangeFeatures(); // Close the edit form
  } catch (error) {
    console.error('Error:', error);
  }
};
  
  const colors = [
    { name: 'blue', color1: '#B5BAE1', color2: '#0F2180' },
    { name: 'green', color1: '#9FE5A6', color2: '#0F6617' },
    { name: 'red', color1: '#C26D6D', color2: '#A70909' },
    { name: 'purple', color1: '#D8B4D9', color2: '#78096F' },
    { name: 'yellow', color1: '#F9F1C7', color2: '#F6D936' },
    { name: 'orange', color1: '#F6AF75', color2: '#EA6A00' },
    { name: 'grey', color1: '#D3D3D3', color2: '#4D4545' },
  ];
  const SettingsColors = [
    { name: 'blue', color1: '#082142', color2: '#0C68E1' },
    { name: 'green', color1: '#166830', color2: '#45965F' },
    { name: 'red', color1: '#820101', color2: '#F14040' },
    { name: 'purple', color1: '#4E1D86', color2: '#78096F' },
    { name: 'yellow', color1: '#FCD128', color2: '#F5DF86' },
    { name: 'orange', color1: '#E08421', color2: '#FBA54B' },
    { name: 'grey', color1: '#3A3939', color2: '#797777' },
  ];
  const SettingsItemsColors = [
    { name: 'blue', color1: '#0253BC'},
    { name: 'green', color1: '#58996D'},
    { name: 'red', color1: '#D14949'},
    { name: 'purple', color1: '#7F55AF'},
    { name: 'yellow', color1: '#F9CD21'},
    { name: 'orange', color1: '#F6AF75'},
    { name: 'grey', color1: '#5C5C5C' },
  ];

  const getGuildColors = (guildColor) => {
    const selectedColorData = colors.find(color => color.name === guildColor);
    return selectedColorData ? `linear-gradient(to top, ${selectedColorData.color1}, ${selectedColorData.color2})` : '';
  };
  const getGuildPostColors = (guildColor) => {
    const selectedColorData = colors.find(color => color.name === guildColor);
    return selectedColorData ? `${selectedColorData.color1}` : '';
  };
  const getGuildSettingsColors = (guildColor) => {
    const selectedColorData = SettingsColors.find(color => color.name === guildColor);
    return selectedColorData ? `linear-gradient(to top, ${selectedColorData.color1}, ${selectedColorData.color2})` : '';
  };
  const getGuildSettingsItemsColors = (guildColor) => {
    const selectedColorData = SettingsItemsColors.find(color => color.name === guildColor);
    return selectedColorData ? `${selectedColorData.color1}` : '';
  };


  const handleBanInputChange = (event) => {
    setBanInputValue(event.target.value);
  };
  const handleReportInputChange = (event) => {
    setReportInputValue(event.target.value);
  };
  const handleWarningInputChange = (event) => {
    setWarningInputValue(event.target.value);
  };
  const handleGuidelinesInputChange = (event) => {
    setGuidelinesinputValue(event.target.value);
  }
  const handleAlertInputChange = (event) => {
    setAlertinputValue(event.target.value);
  }
  const handlePostInputChange = (event) => {
    setPostinputValue(event.target.value);
  }
  const handleCommentInputChange = (event) => {
    setCommentInputValue(event.target.value);
  }
  
  // Function to handle mouse wheel scroll
  const handleScroll = (e) => {
    const container = containerRef.current;
    container.scrollTop += e.deltaY;
  };

  // Function to handle touch events (swipe)
  let touchStartY = 0;
  const handleTouchStart = (e) => {
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const container = containerRef.current;
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - touchStartY;
    container.scrollTop += deltaY * 2; // Adjust the scrolling speed as needed
    touchStartY = touchY;
  };

  const toggleTooltip = (memberId) => {
    setclickedMember(clickedMember === memberId ? null : memberId);
    setShowBanReasonInput(false)
    setBanInputValue('')
  };

  const fetchGuildMembers = async () => {
    try {
      const response = await fetch(`http://localhost:5000/Guilds/JoinedTravelers/${clickedGuild.id || clickedGuild._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      const MembersData = await response.json();
      console.log(MembersData)
      setAllMembers(MembersData);
    } catch (error) {
      console.error('Error fetching all guilds:', error);
    }
  };
  const fetchRequestToJoinMembers = async () => {
    try {
      const response = await fetch(`http://localhost:5000/Guilds/ReqToJoinTavelers/${clickedGuild.id || clickedGuild._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      const travelersData = await response.json();
      console.log(travelersData)
      setRequestedMembers(travelersData.traveler);
    } catch (error) {
      console.error('Error fetching all guilds:', error);
    }
  };
  useEffect(() => {
     // Establish Socket connection
     const socket = io('http://localhost:5000');
     setSocket(socket)
    // make a socket for notifs
    const guildId = clickedGuild.id || clickedGuild._id
     socket.on('connect', () => {
       console.log('connected');
     });
     socket.emit('joinGuildRoom', guildId);
     socket.emit('storeUserIdForGuild', UserData.id || UserData._id)
     socket.emit('Get-Alerts-And-Post', guildId)
     // Clean up socket connection when component unmounts
    fetchGuildMembers();
    fetchRequestToJoinMembers()
    setGuildRequestCount(clickedGuild.guildJoinRequest.length)
    return () => {
      socket.disconnect();
    };
  }, []); 
  useEffect(() => {
    setAlerts(AlertsArray); // Initialize alerts state with AlertsArray
  
    if (socket) {
      // Handle 'like' event
      socket.on('Alert-like', ({ alertId, username }) => {
        setAlerts(prevAlerts => {
          const updatedAlerts = [...prevAlerts];
          const alertIndex = updatedAlerts.findIndex(alert => alert.id === alertId);
          if (alertIndex > -1 && !updatedAlerts[alertIndex].LikesList.includes(username)) {
            updatedAlerts[alertIndex].LikesList.push(username);
            updatedAlerts[alertIndex].Likes = updatedAlerts[alertIndex].LikesList.length;
          }
          return updatedAlerts;
        });
      });
  
      // Handle 'dislike' event
      socket.on('Alert-dislike', ({ alertId, username }) => {
        setAlerts(prevAlerts => {
          const updatedAlerts = [...prevAlerts];
          const alertIndex = updatedAlerts.findIndex(alert => alert.id === alertId);
          if (alertIndex > -1 && !updatedAlerts[alertIndex].DislikesList.includes(username)) {
            updatedAlerts[alertIndex].DislikesList.push(username);
            updatedAlerts[alertIndex].Dislikes = updatedAlerts[alertIndex].DislikesList.length;
          }
          return updatedAlerts;
        });
      });
  
      // Handle 'Removed-reaction' event
      socket.on('Alert-Removed-reaction', ({ alertId, username }) => {
        setAlerts(prevAlerts => {
          const updatedAlerts = [...prevAlerts];
          const alertIndex = updatedAlerts.findIndex(alert => alert.id === alertId);
          
          if (alertIndex > -1) {
            // Remove username from DislikesList if present
            const dislikeIndex = updatedAlerts[alertIndex].DislikesList.indexOf(username);
            if (dislikeIndex !== -1) {
              updatedAlerts[alertIndex].DislikesList.splice(dislikeIndex, 1);
              updatedAlerts[alertIndex].Dislikes = updatedAlerts[alertIndex].DislikesList.length;
            }
  
            // Remove username from LikesList if present
            const likeIndex = updatedAlerts[alertIndex].LikesList.indexOf(username);
            if (likeIndex !== -1) {
              updatedAlerts[alertIndex].LikesList.splice(likeIndex, 1);
              updatedAlerts[alertIndex].Likes = updatedAlerts[alertIndex].LikesList.length;
            }
          }
          return updatedAlerts;
        });
      });
  
      // Cleanup: Remove event listeners when component unmounts
      return () => {
        socket.off('Alert-like');
        socket.off('Alert-dislike');
        socket.off('Alert-Removed-reaction');
      };
    }
  }, [AlertsArray, socket]);
  useEffect(() => {
    setPosts(PostsArray); // Initialize posts state with PostsArray
  
    if (socket) {
      // Handle 'like' event
      socket.on('Post-like', ({ postId, username }) => {
        setPosts(prevPosts => {
          const updatedPosts = [...prevPosts];
          const postIndex = updatedPosts.findIndex(post => post.id === postId);
          if (postIndex > -1 && !updatedPosts[postIndex].LikesList.includes(username)) {
            updatedPosts[postIndex].LikesList.push(username);
            updatedPosts[postIndex].Likes = updatedPosts[postIndex].LikesList.length;
          }
          return updatedPosts;
        });
      });
  
      // Handle 'dislike' event
      socket.on('Post-dislike', ({ postId, username }) => {
        setPosts(prevPosts => {
          const updatedPosts = [...prevPosts];
          const postIndex = updatedPosts.findIndex(post => post.id === postId);
          if (postIndex > -1 && !updatedPosts[postIndex].DislikesList.includes(username)) {
            updatedPosts[postIndex].DislikesList.push(username);
            updatedPosts[postIndex].Dislikes = updatedPosts[postIndex].DislikesList.length;
          }
          return updatedPosts;
        });
      });
  
      // Handle 'Removed-reaction' event
      socket.on('Post-Removed-reaction', ({ postId, username }) => {
        setPosts(prevPosts => {
          const updatedPosts = [...prevPosts];
          const postIndex = updatedPosts.findIndex(post => post.id === postId);
          
          if (postIndex > -1) {
            // Remove username from DislikesList if present
            const dislikeIndex = updatedPosts[postIndex].DislikesList.indexOf(username);
            if (dislikeIndex !== -1) {
              updatedPosts[postIndex].DislikesList.splice(dislikeIndex, 1);
              updatedPosts[postIndex].Dislikes = updatedPosts[postIndex].DislikesList.length;
            }
  
            // Remove username from LikesList if present
            const likeIndex = updatedPosts[postIndex].LikesList.indexOf(username);
            if (likeIndex !== -1) {
              updatedPosts[postIndex].LikesList.splice(likeIndex, 1);
              updatedPosts[postIndex].Likes = updatedPosts[postIndex].LikesList.length;
            }
          }
          return updatedPosts;
        });
      });
  
      // Cleanup: Remove event listeners when component unmounts
      return () => {
        socket.off('Post-like');
        socket.off('Post-dislike');
        socket.off('Post-Removed-reaction');
      };
    }
  }, [PostsArray, socket]);
  useEffect(() => {
    if (socket) {
      socket.on('memberUpdates', (guildMembersWithElders) => {
        console.log('got new member')
        setAllMembers(guildMembersWithElders);
      });
      socket.on('guildReqUpdates', (updatedGuild, joinRequestCount, ReqToJoinTavelers) => {
        console.log('got new request update')
        setclickedGuild(updatedGuild)
        setGuildRequestCount(joinRequestCount)
        setRequestedMembers(ReqToJoinTavelers)
      });
      socket.on('Guild-Settings-updates', (updatedGuild) => {
        console.log('got new guild update')
        setclickedGuild(updatedGuild)
      });
      socket.on('guild-update', (updatedGuild) => {
        console.log('got new guild update')
        setclickedGuild(updatedGuild)
      });
      socket.on('Guild-Alert', (Alert) => {
        console.log('got new guild Alert')
        console.log(Alert)
        setMakeAlertClicked(false)
      });
      socket.on('Guild-Post', (Post) => {
        console.log('got new guild Post')
        console.log(Post)
        setMakePostClicked(false)
      });
      socket.on('Guild-Alerts-And-Post', (GuildDoc) => {
        console.log(GuildDoc)
        if (GuildDoc) {
          setAlertsArray(GuildDoc.Alerts)
          setPostsArray(GuildDoc.post)
        }
      });
      socket.on('Guild-Alerts-Refresh', (GuildDoc) => {
        console.log(GuildDoc)
        if (GuildDoc) {
          setAlerts(GuildDoc.Alerts)
        }
      });
      socket.on('Guild-Posts-Refresh', (GuildDoc,) => {
        console.log(GuildDoc)
        if (GuildDoc) {
          setPosts(GuildDoc.post)
        }
      });
      socket.on('New-Post-Notif', () => {
        setNewPost(true)
      });
    }
  
    // Clean up event listener when component unmounts
    return () => {
      if (socket) {
        socket.off('promote-update');
        socket.off('guildReqUpdates');
      }
    };
  }, [AllMembers]);

  useEffect(() => {
    const handleCommentAdded = (postId, newComment) => {

      setPosts(prevPosts =>
        prevPosts.map(post =>
          (post.id || post._id) === postId ? { ...post, comments: [...post.comments, newComment] } : post
        )
      );
    };
  
    // Listen for the server's confirmation that the comment was added
    if (socket) {
      socket.on('Comment-added', handleCommentAdded);
    }
  
    // Cleanup the event listener on component unmount
    return () => {
      if (socket) {
        socket.off('Comment-added', handleCommentAdded);
      }
    };
  }, [socket]);

  const handleRefreshAndScrollToTop = () => {
    handleGuildPostRefresh();
    topMainFeedRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (MainFeedClicked) {
      topMainFeedRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [MainFeedClicked]);

  const PromoteToElder = (TravelerId) => {
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id;
      console.log('sending emit');
      socket.emit('update-to-elder', GuildId, TravelerId)
    }
  };
  const DemoteToMember = (TravelerId) => {
    // check if this works pls
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id
      console.log('sending emit')
      socket.emit('demote-to-member', GuildId, TravelerId );
    }
  }
  
  const HandleBanMember = () => {
    setShowBanReasonInput(true)
  }

  const BanMember = (TravelerId, Reason) => {
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id
      console.log('sending emit')
      socket.emit('Ban-member', GuildId, TravelerId, Reason );
    }
  }
  const UnbanMember = (TravelerId) => {
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id
      console.log('sending emit')
      socket.emit('Unban-member', GuildId, TravelerId);
    }
  }
  const BanFromReportMember = (TravelerId, Reason, ReportId) => {
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id
      console.log('sending emit')
      socket.emit('Ban-member', GuildId, TravelerId, Reason );
      RemoveReport(ReportId)
    }
  }
  const RemoveReport = (ReportId) => {
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id
      socket.emit('Remove-Report', GuildId, ReportId)
    }
  }
  const ReportMember = (TravelerId, Reason) => {
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id
      console.log('sending emit')
      socket.emit('Report-member', GuildId, TravelerId, Reason );
    }
    setclickedMemberForReport(null)
    setReportInputValue('')
  }
  const WarnMember = (TravelerId, Reason, ReportId) => {
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id
      socket.emit('Warn-member', GuildId, TravelerId, Reason );
    }
    setclickedMemberForWarning(null)
    setWarningInputValue('')
    if (ReportId) {
      RemoveReport(ReportId)
    }
  }
  const WarnMemberFromReport = (Traveler) => {
    setclickedMemberForWarning(Traveler)
    setShowGuildReportList(false);
    setShowGuildWarningUser(true);
  }

  const AcceptJoinRequest = (TravelerId) => {
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id
      console.log('sending emit')
      socket.emit('New-member-Accepted', GuildId, TravelerId );
    }
  }

  const DeclineJoinRequest = (TravelerId) => {
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id
      console.log('sending emit')
      socket.emit('New-member-Declined', GuildId, TravelerId );
    }
  }
  const RetireFromGuild = async (TravelerId) => {
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id;
      console.log('sending emit to leave guild');
      await socket.emit('Retire-From-Guild', GuildId, TravelerId);
    }
  };

  const DisbandGuild = async () => {
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id;
      console.log('sending emit to disband guild');
      socket.emit('Disband-Guild', GuildId, UserData.id || UserData._id);
    }
  };
  const SendMessageToOwner = async () => {
    if (socket) {
      const ElderId = UserData.id || UserData._id
      const content = messageInput
      const GuildId = clickedGuild.id || clickedGuild._id
      socket.emit('Guild-Elder-Messages-E-TO-O', GuildId, ElderId, content)
      setMessageInput('');
    }
  };
  const SendMessageToElder = async () => {
    if (socket) {
      const OwnerId = UserData.id || UserData._id
      const content = messageInput
      const ElderUserName = currentlyclickedelder
      const GuildId = clickedGuild.id || clickedGuild._id
      socket.emit('Guild-Elder-Messages-O-TO-E', GuildId, OwnerId, ElderUserName, content)
      setMessageInput('');
    }
  };
  const SendAlert = async () => {
    if (socket) {
      const OwnerId = UserData.id || UserData._id
      const content = AlertinputValue
      const containsInappropriateWords = inappropriateWords.some(word => content.toLowerCase().includes(word));
      
      if (containsInappropriateWords) {
        alert('Input contains inappropriate content')
        return ;
      }
      const GuildId = clickedGuild.id || clickedGuild._id
      socket.emit('Send-Guild-Alert', GuildId, OwnerId, content)
      setAlertinputValue('');
    }
  };
  const SendPost = async () => {
    if (socket) {
      const posterId = UserData.id || UserData._id
      const content = PostinputValue
      const containsInappropriateWords = inappropriateWords.some(word => content.toLowerCase().includes(word));
      
      if (containsInappropriateWords) {
        alert('Input contains inappropriate content')
        return ;
      }
      const GuildId = clickedGuild.id || clickedGuild._id
      socket.emit('Send-Guild-Post', GuildId, posterId, content)
      setPostinputValue('');
    }
  };

  const ChangeGuidelines = (NewGuidelines) => {
    // check if this works pls
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id
      const containsInappropriateWords = inappropriateWords.some(word => NewGuidelines.toLowerCase().includes(word));
      
      if (containsInappropriateWords) {
        alert('Input contains inappropriate content')
        return ;
      }
      console.log('sending emit')
      socket.emit('Guidelines-updated', GuildId, NewGuidelines);
    }
    setShowGuildGuidelines(false)
    setShowGuildGuidelines2(false)
    setGuidelinesinputValue("")
  }
  const ReportAUser = (Traveler) => {
    setclickedMemberForReport(Traveler);
  }
  const WarnAUser = (Traveler) => {
    setclickedMemberForWarning(Traveler);
  }
  const handleViewGuildStats = () => {
    setShowGuildStats(!ShowGuildStats)
  }
  const handleManageJoinReq = () => {
    setShowGuildJoinRequest(!ShowGuildJoinRequest)
  }
  const handleGuildSettings = () => {
    setShowGuildSettings(!ShowGuildSettings)
  }
  const handleGuildGuidelines = () => {
    setShowGuildGuidelines(!ShowGuildGuidelines)
  }
  const handleGuildGuidelines2 = () => {
    setShowGuildGuidelines2(!ShowGuildGuidelines2)
  }
  const handleChangeFeatures= () => {
    setShowChangeGuildFeatures(!ShowChangeGuildFeatures)
  }
  const handleEditFeatures= () => {
    setShowEditGuildFeatures(!ShowEditGuildFeatures)
  }
  const handleReportAUser= () => {
    setShowGuildReportUser(!ShowGuildReportUser)
  }
  const handleGiveWarning= () => {
    setShowGuildWarningUser(!ShowGuildWarningUser)
  }
  const handleSeeReportList= () => {
    setShowGuildReportList(!ShowGuildReportList)
  }
  const handleShowWarnings= () => {
    setShowWarnings(!ShowWarnings)
  }
  const handleShowBanList= () => {
    setShowBannedTravelers(!ShowBannedTravelers)
  }
  const handleShowReportGuild= () => {
    setShowReportGuild(!ShowReportGuild)
  }
  const handleShowElderMessages= () => {
    setShowElderMessages(!ShowElderMessages)
  }
  const handleShowDisbandWarning= () => {
    setShowDisbandWarning(!ShowDisbandWarning)
  }
  const handleYourPostClicked= () => {
    setMainFeedClicked(false)
    setGuildAlertsClicked(false)
    setYourPostClicked(true)
  }
  const handleMainFeedClick= () => {
    setGuildAlertsClicked(false)
    setMainFeedClicked(true)
    setYourPostClicked(false)
  }
  const handleGuildAlertClick= () => {
    setMainFeedClicked(false)
    setGuildAlertsClicked(true)
    setYourPostClicked(false)
  }
  const handleGuildAlertRefresh= () => {
    if (socket) {
      const guildId = clickedGuild.id || clickedGuild._id
      socket.emit('Get-Alerts', guildId, UserData.id || UserData._id)
    }
  }
  const handleCommentClick = (postId) => {
    if (CommentinputValue !== '') {
      setCommentInputValue('')
    }
    if (CommentClicked === postId) {
      setCommentClicked(null); // Toggle off if the same post is clicked again
    } else {
      setCommentClicked(postId); // Set the clicked post ID
    }
  };
  const handleAlertLike = (alertId) => {
    setAlerts(prevAlerts => {
      const updatedAlerts = [...prevAlerts];
      const alertIndex = updatedAlerts.findIndex(alert => alert.id === alertId || alert._id === alertId);
      if (alertIndex > -1 && !updatedAlerts[alertIndex].LikesList.includes(UserData.username)) {
        updatedAlerts[alertIndex].LikesList.push(UserData.username);
        updatedAlerts[alertIndex].Likes = updatedAlerts[alertIndex].LikesList.length;
  
        // Ensure the user isn't in the DislikesList if they liked the alert
        const dislikeIndex = updatedAlerts[alertIndex].DislikesList.indexOf(UserData.username);
        if (dislikeIndex !== -1) {
          updatedAlerts[alertIndex].DislikesList.splice(dislikeIndex, 1);
          updatedAlerts[alertIndex].Dislikes = updatedAlerts[alertIndex].DislikesList.length;
        }
      }
      return updatedAlerts;
    });
    const GuildId = clickedGuild.id || clickedGuild._id
    socket.emit('like-alert', { alertId, username: UserData.username}, GuildId);
  };
  
  const handleAlertDislike = (alertId) => {
    setAlerts(prevAlerts => {
      const updatedAlerts = [...prevAlerts];
      const alertIndex = updatedAlerts.findIndex(alert => alert.id === alertId || alert._id === alertId);
      if (alertIndex > -1 && !updatedAlerts[alertIndex].DislikesList.includes(UserData.username)) {
        updatedAlerts[alertIndex].DislikesList.push(UserData.username);
        updatedAlerts[alertIndex].Dislikes = updatedAlerts[alertIndex].DislikesList.length;
  
        // Ensure the user isn't in the LikesList if they disliked the alert
        const likeIndex = updatedAlerts[alertIndex].LikesList.indexOf(UserData.username);
        if (likeIndex !== -1) {
          updatedAlerts[alertIndex].LikesList.splice(likeIndex, 1);
          updatedAlerts[alertIndex].Likes = updatedAlerts[alertIndex].LikesList.length;
        }
      }
      return updatedAlerts;
    });
    const GuildId = clickedGuild.id || clickedGuild._id
    socket.emit('dislike-alert', { alertId, username: UserData.username }, GuildId);
  };
  const handleAlertRemoveReaction = (alertId) => {
    setAlerts(prevAlerts => {
      const updatedAlerts = [...prevAlerts];
      const alertIndex = updatedAlerts.findIndex(alert => alert.id === alertId || alert._id === alertId);
      if (alertIndex > -1 && !updatedAlerts[alertIndex].DislikesList.includes(UserData.username) || alertIndex > -1 && !updatedAlerts[alertIndex].LikesList.includes(UserData.username)) {
        // Ensure the user isn't in the DislikesList if they liked the alert
        const dislikeIndex = updatedAlerts[alertIndex].DislikesList.indexOf(UserData.username);
        if (dislikeIndex !== -1) {
          updatedAlerts[alertIndex].DislikesList.splice(dislikeIndex, 1);
          updatedAlerts[alertIndex].Dislikes = updatedAlerts[alertIndex].DislikesList.length;
        }
        // Ensure the user isn't in the LikesList if they disliked the alert
        const likeIndex = updatedAlerts[alertIndex].LikesList.indexOf(UserData.username);
        if (likeIndex !== -1) {
          updatedAlerts[alertIndex].LikesList.splice(likeIndex, 1);
          updatedAlerts[alertIndex].Likes = updatedAlerts[alertIndex].LikesList.length;
        }
      }
      return updatedAlerts;
    });
    const GuildId = clickedGuild.id || clickedGuild._id
    socket.emit('Alert-Remove-Reaction', { alertId, username: UserData.username }, GuildId);
  };
  const handleGuildPostRefresh= () => {
    if (socket) {
      const guildId = clickedGuild.id || clickedGuild._id
      socket.emit('Get-Posts', guildId, UserData.id || UserData._id)
      setNewPost(false)
    }
  }
  const handlePostLike = (postId) => {
    setPosts(prevPosts => {
      const updatedPosts = [...prevPosts];
      const postIndex = updatedPosts.findIndex(post => post.id === postId || post._id === postId);
      if (postIndex > -1 && !updatedPosts[postIndex].LikesList.includes(UserData.username)) {
        updatedPosts[postIndex].LikesList.push(UserData.username);
        updatedPosts[postIndex].Likes = updatedPosts[postIndex].LikesList.length;
  
        // Ensure the user isn't in the DislikesList if they liked the post
        const dislikeIndex = updatedPosts[postIndex].DislikesList.indexOf(UserData.username);
        if (dislikeIndex !== -1) {
          updatedPosts[postIndex].DislikesList.splice(dislikeIndex, 1);
          updatedPosts[postIndex].Dislikes = updatedPosts[postIndex].DislikesList.length;
        }
      }
      return updatedPosts;
    });
    const GuildId = clickedGuild.id || clickedGuild._id
    socket.emit('like-post', { postId, username: UserData.username}, GuildId);
  };
  
  const handlePostDislike = (postId) => {
    setPosts(prevPosts => {
      const updatedPosts = [...prevPosts];
      const postIndex = updatedPosts.findIndex(post => post.id === postId || post._id === postId);
      if (postIndex > -1 && !updatedPosts[postIndex].DislikesList.includes(UserData.username)) {
        updatedPosts[postIndex].DislikesList.push(UserData.username);
        updatedPosts[postIndex].Dislikes = updatedPosts[postIndex].DislikesList.length;
  
        // Ensure the user isn't in the LikesList if they disliked the post
        const likeIndex = updatedPosts[postIndex].LikesList.indexOf(UserData.username);
        if (likeIndex !== -1) {
          updatedPosts[postIndex].LikesList.splice(likeIndex, 1);
          updatedPosts[postIndex].Likes = updatedPosts[postIndex].LikesList.length;
        }
      }
      return updatedPosts;
    });
    const GuildId = clickedGuild.id || clickedGuild._id
    socket.emit('dislike-post', { postId, username: UserData.username }, GuildId);
  };
  const handlePostRemoveReaction = (postId) => {
    setPosts(prevPosts => {
      const updatedPosts = [...prevPosts];
      const postIndex = updatedPosts.findIndex(post => post.id === postId || post._id === postId);
      if (postIndex > -1 && !updatedPosts[postIndex].DislikesList.includes(UserData.username) || postIndex > -1 && !updatedPosts[postIndex].LikesList.includes(UserData.username)) {
        // Ensure the user isn't in the DislikesList if they liked the Post
        const dislikeIndex = updatedPosts[postIndex].DislikesList.indexOf(UserData.username);
        if (dislikeIndex !== -1) {
          updatedPosts[postIndex].DislikesList.splice(dislikeIndex, 1);
          updatedPosts[postIndex].Dislikes = updatedPosts[postIndex].DislikesList.length;
        }
        // Ensure the user isn't in the LikesList if they disliked the Post
        const likeIndex = updatedPosts[postIndex].LikesList.indexOf(UserData.username);
        if (likeIndex !== -1) {
          updatedPosts[postIndex].LikesList.splice(likeIndex, 1);
          updatedPosts[postIndex].Likes = updatedPosts[postIndex].LikesList.length;
        }
      }
      return updatedPosts;
    });
    const GuildId = clickedGuild.id || clickedGuild._id
    socket.emit('Post-Remove-Reaction', { postId, username: UserData.username }, GuildId);
  };
  const handlePostComment = (postId) => {
    const CommenterId = UserData.id || UserData._id;
    const GuildId = clickedGuild.id || clickedGuild._id;
    const comment = {
      id: new Date().toISOString(),
      commentingUserName: UserData.username,
      commentPost: { content: CommentinputValue }
    };
    const containsInappropriateWords = inappropriateWords.some(word => CommentinputValue.toLowerCase().includes(word));
      
    if (containsInappropriateWords) {
      alert('Input contains inappropriate content')
      return ;
    }
    
      // Emit the comment event to the server
      socket.emit('Comment-post', postId, CommenterId, GuildId, comment);
      setCommentInputValue('');
    };
  
  return (
    <div style={{background: getGuildColors(clickedGuild.guildColor)}} className='Guild-Pages-main-div'>
      <div className="Guild-Pages-left-side">
        <div className="GP-left-side-2nd" >
        </div>
        {AllMembers && (
          <div className="members-div"
            ref={containerRef}
            onWheel={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            style={{width: '98%', paddingLeft: '5px', marginTop: '10px'}}>
            <h3 style={{cursor: 'pointer'}} onClick={() => toggleTooltip(AllMembers.Owner.id)}>{AllMembers.Owner.UserName} <span style={{fontSize: '14px', fontWeight: '400'}}>Owner</span></h3>
            {UserData.username !== AllMembers.Owner.UserName && (
              <div className="guild-Owner-tooltip" style={{ display: clickedMember === AllMembers.Owner.id ? 'block' : 'none' }}>
                <Link to={`/user/${AllMembers.Owner.UserName}`}><div style={{color: 'white'}}>View {AllMembers.Owner.UserName}'s Profile</div></Link> 
              </div>
            )}
            <hr/>
            <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
              {AllMembers.Elders
              .map((elder) => (
                <div>
                  <h3 style={{cursor: 'pointer', wordBreak: 'break-word'}} onClick={() => toggleTooltip(elder.id)}>{elder.UserName } <span style={{fontSize: '14px', fontWeight: '400'}}>Elder</span></h3>
                  {UserData.username !== elder.UserName && (
                    <div className="guild-member-tooltip" style={{ display: clickedMember === elder.id ? 'block' : 'none' }}>
                    {!elder.AccPrivate && (<Link to={`/user/${elder.UserName}`}><div style={{color: 'white'}}>View {elder.UserName}'s Profile</div></Link>)}
                    {elder.AccPrivate && (<div>{elder.UserName}'s Profile Is Private</div>)}
                      {UserData.username === AllMembers.Owner.UserName && (
                        <div style={{cursor: 'pointer'}} onClick={() => {DemoteToMember(elder.id || elder._id)}}>Demote to Member</div>
                      )}
                      <hr style={{margin: '3px'}}/>
                      {UserData.username === AllMembers.Owner.UserName  && (
                        <div style={{cursor: 'pointer'}} onClick={() => {HandleBanMember(elder.id || elder._id)}}>Ban From Guild</div>
                      )}
                      { ShowBanReasonInput && (<div className="guild-ban-tooltip" style={{ display: clickedMember === elder.id ? 'block' : 'none' }}>
                        <div>Reason For Ban: </div>
                        <input
                          type="text"
                          value={BaninputValue}
                          onChange={handleBanInputChange}
                        />
                        <button onClick={() => {BanMember(elder.id || elder._id, BaninputValue )}}>Confirm Ban</button>
                      </div>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {AllMembers.Elders.length !== 0 && (<hr/>)}
            <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
            {AllMembers.Members
            .map((member) => (
              <div key={member.id}>
                <h3 style={{cursor: 'pointer', wordBreak: 'break-word'}} onClick={() => toggleTooltip(member.id)}>
                  {member.UserName} <span style={{fontSize: '14px', fontWeight: '400'}}>Member</span>
                </h3>
                {UserData.username !== member.UserName && (
                  <div className="guild-member-tooltip" style={{ display: clickedMember === member.id ? 'block' : 'none' }}>
                    {!member.AccPrivate && (<Link to={`/user/${member.UserName}`}><div style={{color: 'white'}}>View {member.UserName}'s Profile</div></Link>)}
                    {member.AccPrivate && (<div>{member.UserName}'s Profile Is Private</div>)}
                    {UserData.username === AllMembers.Owner.UserName && (
                      <div style={{cursor: 'pointer'}} onClick={() => {PromoteToElder(member.id || member._id)}}>Promote to Elder</div>
                    )}
                    <hr style={{margin: '3px'}}/>
                    {(UserData.username === AllMembers.Owner.UserName || AllMembers.Elders.some(elder => elder.UserName === UserData.username)) && (
                      <div style={{cursor: 'pointer'}} onClick={() => {HandleBanMember(member.id || member._id)}}>Ban From Guild</div>
                    )}
                    { ShowBanReasonInput && (<div className="guild-ban-tooltip" style={{ display: clickedMember === member.id ? 'block' : 'none' }}>
                      <div>Reason For Ban: </div>
                      <input
                        type="text"
                        value={BaninputValue}
                        onChange={handleBanInputChange}
                      />
                      <button onClick={() => {BanMember(member.id || member._id, BaninputValue )}}>Confirm Ban</button>
                    </div>)}
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
      <div className="Guild-Pages-middle-side">
        <div className="Top-Middle-NavBar">
        <div style={{marginLeft: '-20%'}} onClick={handleYourPostClicked} className={YourPostClicked ? "Bold" : 'not'} >Your Post</div>
          <div onClick={handleMainFeedClick} className={MainFeedClicked ? "Bold" : 'not'} >Main Feed</div>
          <div style={{marginRight: '-21%'}} onClick={handleGuildAlertClick}  className={GuildAlertsClicked ? "Bold" : 'not'} >Guild Alerts</div>
        </div>
        {MainFeedClicked && (
          <div>
            {NewPost && (<div onClick={handleRefreshAndScrollToTop} >THERE IS A NEW POST</div>)}
            {!CommentClicked && (<img src={reloadicon} className="guild-reload-icon" onClick={handleRefreshAndScrollToTop} ></img>)}
            <div  className="Main-Post-Feed">
              <div ref={topMainFeedRef}><h2>POSTS</h2></div>
            {posts && posts.slice().reverse().map(Post => (
              <div style={{ background: getGuildPostColors(clickedGuild.guildColor) }} className="Alerts-Div" key={Post.id}>
                <div className="Alert-Content">
                  <div style={{fontWeight: '600'}}>{Post.PosterUserName}</div>
                  <div style={{wordBreak: 'break-word'}}>{Post.content}</div>
                </div>
                {Post.PosterUserName !== UserData.username && !Post.LikesList.includes(UserData.username) && !Post.DislikesList.includes(UserData.username) && (
                  <div className="Alert-Reactions">
                    <span
                      style={{ marginLeft: '0%', cursor: 'pointer', paddingTop: '10px'}}
                      onClick={() => handlePostLike(Post.id || Post._id)}
                    ><img style={{width: '30px'}} src={Likeicon}></img></span>
                    <span
                      onClick={() => handleCommentClick(Post.id || Post._id)}
                      style={{ marginLeft: '2%', marginRight: '2%', cursor: 'pointer', paddingTop: '10px' }}
                    ><img style={{width: '30px'}} src={commenticon}></img></span>
                    <span
                      style={{ marginRight: '0%', cursor: 'pointer', paddingTop: '10px' }}
                      onClick={() => handlePostDislike(Post.id || Post._id)}
                    ><img style={{width: '30px'}} src={dislikeicon}></img></span>
                  </div>
                )}
                {Post.PosterUserName !== UserData.username && Post.LikesList.includes(UserData.username) && (
                  <div className="Alert-Reactions">
                    <span 
                      style={{ color: 'blue', marginLeft: '0%', cursor: 'pointer', paddingTop: '10px'  }}
                      onClick={() => handlePostRemoveReaction(Post.id || Post._id)}
                    ><img style={{width: '30px'}} src={likedicon}></img></span>
                    <span
                      onClick={() => handleCommentClick(Post.id || Post._id)}
                      style={{ marginLeft: '2%', marginRight: '2%', cursor: 'pointer', paddingTop: '10px'  }}
                    ><img style={{width: '30px'}} src={commenticon}></img></span>
                    <span
                      style={{ marginRight: '10%', cursor: 'pointer', paddingTop: '10px'  }}
                      onClick={() => handlePostDislike(Post.id || Post._id)}
                    ><img style={{width: '30px'}} src={dislikeicon}></img></span>
                  </div>
                )}
                {Post.PosterUserName !== UserData.username && Post.DislikesList.includes(UserData.username) && (
                  <div className="Alert-Reactions">
                    <span
                      style={{ marginLeft: '10%', cursor: 'pointer', paddingTop: '10px'  }}
                      onClick={() => handlePostLike(Post.id || Post._id)}
                    ><img style={{width: '30px'}} src={Likeicon}></img></span>
                    <span
                      onClick={() => handleCommentClick(Post.id || Post._id)}
                      style={{ marginLeft: '2%', marginRight: '2%', cursor: 'pointer', paddingTop: '10px'  }}
                    ><img style={{width: '30px'}} src={commenticon}></img></span>
                    <span 
                      style={{ color: 'Red', marginRight: '10%', cursor: 'pointer', paddingTop: '10px'  }}
                      onClick={() => handlePostRemoveReaction(Post.id || Post._id)}
                    ><img style={{width: '30px'}} src={dislikedicon}></img></span>
                  </div>
                )}
                {Post.PosterUserName === UserData.username && (
                  <div className="Alert-Reactions">
                    <span style={{ fontSize: '20px', marginLeft: '0%', cursor: 'pointer', paddingTop: '10px'  }}><img style={{width: '30px'}} src={likedicon}></img> {Post.Likes}</span>
                    <span onClick={() => handleCommentClick(Post.id || Post._id)} style={{ fontSize: '20px', marginLeft: '0%', cursor: 'pointer', paddingTop: '10px'  }}><img style={{width: '30px'}} src={commenticon}></img> {Post.comments.length}</span>
                    <span style={{ fontSize: '20px', marginRight: '0%', cursor: 'pointer', paddingTop: '10px'  }}><img style={{width: '30px'}} src={dislikedicon}></img> {Post.Dislikes}</span>
                  </div>
                )}
                {CommentClicked === (Post.id || Post._id) && (
                  <div className="Make-Comment-main-div">
                    <div style={{ background: getGuildPostColors(clickedGuild.guildColor) }} className="Alerts-Div">
                      <div style={{height: '180px', overflowY: 'auto'}}className="Alert-Content">
                        <div>{Post.PosterUserName}</div>
                        <div style={{wordBreak: 'break-word'}}>{Post.content}</div>
                      </div>
                      <div style={{ width: '100%', borderTop: 'black solid 2px', fontSize: '18px', paddingBottom: '20px' }}>Comments: {Post.comments.length}</div>
                      <div style={{ height: '100%' }}>
                        <div style={{ height: '300px', overflowY: 'auto' }}>
                          {Post.comments && Post.comments.slice().reverse().map(Comment => (
                            <div className="comments-main-div" key={Comment.id}>
                              <div style={{ fontSize: '18px' }}>{Comment.commentingUserName}</div>
                              <div className="comments-main-comment">{Comment.commentPost.content}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <input className="comment-input" placeholder="Comment: " value={CommentinputValue} onChange={handleCommentInputChange}></input>
                      <div style={{ width: '90%', paddingRight: '5%', paddingLeft: '5%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: '2%', borderTop: '4px groove black' }}><span onClick={() => handleCommentClick(null)}>BACK</span><span onClick={() => { handlePostComment(Post.id || Post._id) }}>Post</span></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {!CommentClicked && (<div onClick={() => {setMakePostClicked(true)}} style={{bottom: '1%', left: '21%', position: 'absolute'}}>Make A Post</div>)}
          {MakePostClicked && (
            <div style={{zIndex:'1000'}}  className="Make-Alert-main-div">
              <div className="Make-Alert">
                MAKE A POST
                <p><span style={{fontFamily: '"MedievalSharp", cursive'}}>FROM:</span> {UserData.username}</p>
                <textarea
                  className="TA-make-alert"
                  value={PostinputValue}
                  onChange={handlePostInputChange}
                ></textarea> 
                <p><span style={{fontFamily: '"MedievalSharp", cursive'}}>TO:</span> {clickedGuild.guildName}</p>
                <div style={{ color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <div onClick={() => {setMakePostClicked(false)}} style={{ fontSize: '28px', cursor: 'pointer', border: 'solid black 2px', borderRadius: '10px', padding: '5px', background: 'red', color: 'white'}}>Cancel</div>
                  <div onClick={SendPost} style={{ fontSize: '28px', cursor: 'pointer', border: 'solid black 2px', borderRadius: '10px', padding: '5px', background: 'black', color: 'white'}}>Post</div>
                </div>
              </div>
            </div>
          )}
        </div>
        )}
        {YourPostClicked && (
          <div>
            <div  className="Main-Post-Feed"> <h2>YOUR POSTS</h2>
            {posts && posts.filter(Post => Post.PosterUserName === UserData.username).slice().reverse().map(Post => (
              <div style={{ background: getGuildPostColors(clickedGuild.guildColor) }} className="Alerts-Div" key={Post.id}>
                <div  className="Alert-Content">
                  <div style={{fontWeight: '600'}}>{Post.PosterUserName}</div>
                  <div>{Post.content}</div>
                </div>
                {Post.PosterUserName === UserData.username && (
                  <div className="Alert-Reactions">
                    <span style={{ fontSize: '20px', marginLeft: '0%', cursor: 'pointer' }}>Likes: {Post.Likes}</span>
                    <span onClick={() => handleCommentClick(Post.id || Post._id)} style={{fontSize: '20px',  marginLeft: '0%', cursor: 'pointer' }}>Comments: {Post.comments.length}</span>
                    <span style={{fontSize: '20px',  marginRight: '0%', cursor: 'pointer' }}>Dislikes: {Post.Dislikes}</span>
                  </div>
                )}
                {CommentClicked === (Post.id || Post._id) && (
                  <div className="Make-Comment-main-div">
                    <div style={{ background: getGuildPostColors(clickedGuild.guildColor) }} className="Alerts-Div">
                      <div className="Alert-Content">
                        <div>{Post.PosterUserName}</div>
                        <div>{Post.content}</div>
                      </div>
                      <div style={{ width: '100%', borderTop: 'black solid 2px', fontSize: '18px', paddingBottom: '20px' }}>Comments: {Post.comments.length}</div>
                      <div style={{ height: '100%' }}>
                        <div style={{ height: '400px', overflowY: 'auto' }}>
                          {Post.comments && Post.comments.slice().reverse().map(Comment => (
                            <div className="comments-main-div" key={Comment.id}>
                              <div style={{ fontSize: '18px' }}>{Comment.commentingUserName}</div>
                              <div className="comments-main-comment">{Comment.commentPost.content}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <input className="comment-input" placeholder="Comment: " value={CommentinputValue} onChange={handleCommentInputChange}></input>
                      <div style={{ width: '90%', paddingRight: '5%', paddingLeft: '5%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: '2%', borderTop: '4px groove black' }}><span onClick={() => handleCommentClick(null)}>BACK</span><span onClick={() => { handlePostComment(Post.id || Post._id) }}>Post</span></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {!CommentClicked && (<div onClick={() => {setMakePostClicked(true)}} style={{bottom: '1%', left: '21%', position: 'absolute'}}>Make A Post</div>)}
          {MakePostClicked && (
            <div style={{zIndex:'1000'}} className="Make-Alert-main-div">
              <div className="Make-Alert">
                MAKE A POST
                <p><span style={{fontFamily: '"MedievalSharp", cursive'}}>FROM:</span> {UserData.username}</p>
                <textarea
                  className="TA-make-alert"
                  value={PostinputValue}
                  onChange={handlePostInputChange}
                ></textarea> 
                <p><span style={{fontFamily: '"MedievalSharp", cursive'}}>TO:</span> {clickedGuild.guildName}</p>
                <div style={{ color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <div onClick={() => {setMakePostClicked(false)}} style={{ fontSize: '28px', cursor: 'pointer', border: 'solid black 2px', borderRadius: '10px', padding: '5px', background: 'red', color: 'white'}}>Cancel</div>
                  <div onClick={SendPost} style={{ fontSize: '28px', cursor: 'pointer', border: 'solid black 2px', borderRadius: '10px', padding: '5px', background: 'black', color: 'white'}}>Post</div>
                </div>
              </div>
            </div>
          )}
        </div>
        )}
        {GuildAlertsClicked && (
          <div>
            <img onClick={handleGuildAlertRefresh} src={reloadicon} className="guild-reload-icon"  ></img>
            <div  className="Main-Post-Feed"><h2>ALERTS</h2>
            {alerts && alerts.slice().reverse().map(Alert => (
              <div style={{ background: getGuildPostColors(clickedGuild.guildColor) }} className="Alerts-Div" key={Alert.id}>
                <div className="Alert-Content">
                  <div style={{fontWeight: '600'}}>{Alert.PosterUserName}</div>
                  <div>{Alert.content}</div>
                </div>
                {Alert.PosterUserName !== UserData.username && !Alert.LikesList.includes(UserData.username) && !Alert.DislikesList.includes(UserData.username) && (
                  <div className="Alert-Reactions">
                    <span
                      style={{ marginLeft: '10%', cursor: 'pointer' }}
                      onClick={() => handleAlertLike(Alert.id || Alert._id)}
                    >Like</span>
                    <span
                      style={{ marginRight: '10%', cursor: 'pointer' }}
                      onClick={() => handleAlertDislike(Alert.id || Alert._id)}
                    >Dislike</span>
                  </div>
                )}
                {Alert.PosterUserName !== UserData.username && Alert.LikesList.includes(UserData.username) && (
                  <div className="Alert-Reactions">
                    <span 
                      style={{ color: 'blue', marginLeft: '10%', cursor: 'pointer' }}
                      onClick={() => handleAlertRemoveReaction(Alert.id || Alert._id)}
                    >Liked</span>
                    <span
                      style={{ marginRight: '10%', cursor: 'pointer' }}
                      onClick={() => handleAlertDislike(Alert.id || Alert._id)}
                    >Dislike</span>
                  </div>
                )}
                {Alert.PosterUserName !== UserData.username && Alert.DislikesList.includes(UserData.username) && (
                  <div className="Alert-Reactions">
                    <span
                      style={{ marginLeft: '10%', cursor: 'pointer' }}
                      onClick={() => handleAlertLike(Alert.id || Alert._id)}
                    >Like</span>
                    <span 
                      style={{ color: 'Red', marginRight: '10%', cursor: 'pointer' }}
                      onClick={() => handleAlertRemoveReaction(Alert.id || Alert._id)}
                    >Disliked</span>
                  </div>
                )}
                {Alert.PosterUserName === UserData.username && (
                  <div className="Alert-Reactions">
                    <span style={{ marginLeft: '10%', cursor: 'pointer' }}>Likes: {Alert.Likes}</span>
                    <span style={{ marginRight: '10%', cursor: 'pointer' }}>Dislikes: {Alert.Dislikes}</span>
                  </div>
                )}
              </div>
            ))}
            </div>
            {AllMembers && UserData.username === AllMembers.Owner.UserName && (<div onClick={() => {setMakeAlertClicked(true)}} style={{bottom: '1%', left: '21%', position: 'absolute'}}>Make A Alert</div>)}
            {MakeAlertClicked && (
              <div style={{zIndex:'1000'}} className="Make-Alert-main-div">
                <div className="Make-Alert">
                  <p><span style={{fontFamily: '"MedievalSharp", cursive'}}>FROM:</span> {UserData.username}</p>
                  <textarea
                    className="TA-make-alert"
                    value={AlertinputValue}
                    onChange={handleAlertInputChange}
                  ></textarea> 
                  <p><span style={{fontFamily: '"MedievalSharp", cursive'}}>TO:</span> {clickedGuild.guildName}</p>
                  <div style={{ color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <div onClick={() => {setMakeAlertClicked(false)}} style={{ fontSize: '28px', cursor: 'pointer', border: 'solid black 2px', borderRadius: '10px', padding: '5px', background: 'red', color: 'white'}}>Cancel</div>
                    <div onClick={SendAlert} style={{ fontSize: '28px', cursor: 'pointer', border: 'solid black 2px', borderRadius: '10px', padding: '5px', background: 'black', color: 'white'}}>Alert</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="Guild-Pages-right-side">
        <h4 style={{marginTop: '85px'}}></h4>
        {/* for owner */}
        {AllMembers && UserData.username === AllMembers.Owner.UserName && (
          <div className="guild-rightside-div">
            <h3 onClick={handleViewGuildStats} style={{cursor: 'pointer'}}>View Guild Stats</h3>
            <h3 onClick={handleManageJoinReq} style={{cursor: 'pointer'}}>Manage Guild Join request <span className="guild-req-counter">{GuildRequestCount}</span></h3>
            <h3 onClick={handleShowElderMessages}>View Elder messages</h3>
            <h3 className="guild-settings" onClick={handleGuildSettings}>Guild Settings</h3>
          </div>
        )}
        {/* for elders */}
        {AllMembers && AllMembers.Elders.some(elder => elder.UserName === UserData.username) && (
          <div className="guild-rightside-div">
            <h3 onClick={handleViewGuildStats} style={{cursor: 'pointer'}}>View Guild Stats</h3>
            <h3 onClick={handleManageJoinReq} style={{cursor: 'pointer'}}>Manage Guild Join request <span className="guild-req-counter">{GuildRequestCount}</span></h3>
            <h3 onClick={handleShowWarnings}>
              View Warnings
              {clickedGuild.Warnings.filter(warning => warning.TravelerUserName === UserData.username).length > 0 && (
                <span className="warning-notif-number">
                  {clickedGuild.Warnings.filter(warning => warning.TravelerUserName === UserData.username).length}
                </span>
              )}
            </h3>
            <h3 onClick={handleShowElderMessages}>Send a message up to Guild Master</h3>
            <h3 className="guild-settings" onClick={handleGuildSettings}>Guild Settings</h3>
          </div>
        )}
        {/* for members */}
        {AllMembers && AllMembers.Members.some(Member => Member.UserName === UserData.username) && (
          <div className="guild-rightside-div">
            <h3 onClick={handleViewGuildStats} style={{cursor: 'pointer'}}>View Guild Stats</h3>
            <h3 onClick={handleShowWarnings}>
              View Warnings
              {clickedGuild.Warnings.filter(warning => warning.TravelerUserName === UserData.username).length > 0 && (
                <span className="warning-notif-number">
                  {clickedGuild.Warnings.filter(warning => warning.TravelerUserName === UserData.username).length}
                </span>
              )}
            </h3>
            <h3 className="guild-settings" onClick={handleGuildSettings}>Guild Settings</h3>
          </div>
        )}
      </div>
      {ShowGuildStats && (
        <div style={{color: 'white',background: getGuildSettingsColors(clickedGuild.guildColor)}} className="Guild-stats-popup">
          <div style={{width: '98%', display: 'flex', flexDirection: 'column', justifyContent: 'center',gap: '10px'}}>
            <div><h3>{clickedGuild.guildName}</h3></div>
            <div>Guild Privacy: {clickedGuild.Findable ? 'Findable' : 'Private'}</div>
            <div>Request To Join: {clickedGuild.RequestToJoin ? 'Yes' : 'No'}</div>
            <div>Owner: {AllMembers.Owner.UserName}</div>
            <div>Guild Color: {clickedGuild.guildColor}</div>
            <div>Guild Creation Date: {clickedGuild.guildDate ? clickedGuild.guildDate.substring(0, 10) : ''}</div>
            <div> # of Members: {clickedGuild.joinedTravelers.length + clickedGuild.guildElders.length}</div>
            <div># of Post: {clickedGuild.guildPost.length}</div>
            <div># of Banned Travelers: {clickedGuild.bannedTravelers.length}</div>
            <div style={{alignSelf: 'center', cursor: 'pointer'}} onClick={handleViewGuildStats}>Finish</div>
          </div>
        </div>
      )}
      {ShowGuildJoinRequest && (
        <div className="Guild-Request-popup">
          {clickedGuild.RequestToJoin ? (
            <div>
              <div style={{marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
                <p>You currently have {clickedGuild.guildJoinRequest.length} join request.</p>
                <p style={{position: 'absolute', bottom: '0', cursor: 'pointer'}} onClick={handleManageJoinReq}>Finish</p>
              </div>
              {clickedGuild.guildJoinRequest.length !== 0 && (
                <div>
                  {RequestedMembers.map((traveler, index) => ( // Added parentheses and index parameter
                    <div style={{background: getGuildSettingsColors(clickedGuild.guildColor)}} className="ReqMember-item" key={index}> {/* Added key for each mapped element */}
                      <div>
                        {traveler.UserName}
                        {traveler.AccPrivate ? (
                          <div>This Account is Private</div>
                        ) : (
                          <Link to={`/user/${traveler.UserName}`}>
                            <div>View Profile</div>
                          </Link>
                        )}
                      </div>
                      <div style={{display: 'flex', flexDirection: 'column', gap:'10px'}}>
                        <div style={{cursor: 'pointer'}} onClick={() => {AcceptJoinRequest(traveler.id || traveler._id)}}>Accept Request</div>
                        <div style={{cursor: 'pointer'}} onClick={() => {DeclineJoinRequest(traveler.id || traveler._id)}}>Decline Request</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <p style={{textAlign: 'center'}}>Your guild is currently open for all to join. To change this, go to guild settings.</p>
              <h3 onClick={handleManageJoinReq} style={{position: 'absolute', bottom: '0', right: '10px', cursor: 'pointer'}}>Finish</h3>
            </div>
          )}
        </div>
      )}
      {ShowGuildSettings && (
        <div style={{background: getGuildSettingsColors(clickedGuild.guildColor)}} className="guild-settings-div">
          {AllMembers && AllMembers.Members.some(Member => Member.UserName === UserData.username) && (
            <div className="guild-settings-popup">
              <div onClick={handleGuildSettings} style={{alignSelf: 'flex-start', cursor: 'pointer'}}>Finish</div>
              <div style={{background: getGuildSettingsItemsColors(clickedGuild.guildColor)}} className="guild-settings-popup-item" onClick={handleGuildGuidelines}>View Guild guidelines</div>
              <div style={{background: getGuildSettingsItemsColors(clickedGuild.guildColor)}} className="guild-settings-popup-item" onClick={handleReportAUser}>Report A Guild User</div>
              <div style={{background: getGuildSettingsItemsColors(clickedGuild.guildColor)}} className="guild-settings-popup-item" onClick={handleShowReportGuild}>Report Guild</div>
              <div style={{background: getGuildSettingsItemsColors(clickedGuild.guildColor)}} className="guild-settings-popup-item" onClick={() => {setShowFinalLeave(!ShowFinalLeave)}}>Retire From Guild</div>
              {ShowFinalLeave && (
                <div className="guild-Report-A-User" style={{border: 'black solid 1px', zIndex: '10000'}}>
                  <h2>Are you Sure You Want To Leave the Guild?</h2>
                  <p><span style={{paddingRight: '90px'}} onClick={() => {RetireFromGuild(UserData.id || UserData._id)}}> Yes </span>       <span onClick={() => {setShowFinalLeave(!ShowFinalLeave)}}> No </span></p>
                </div>
              )}
            </div>
          )}
          {AllMembers && AllMembers.Elders.some(elder => elder.UserName === UserData.username) && (
            <div className="guild-settings-popup">
              <div onClick={handleGuildSettings} style={{alignSelf: 'flex-start', cursor: 'pointer'}}>Finish</div>
              <div style={{background: getGuildSettingsItemsColors(clickedGuild.guildColor)}} className="guild-settings-popup-item" onClick={handleGuildGuidelines}>View Guild guidelines</div>
              <div style={{background: getGuildSettingsItemsColors(clickedGuild.guildColor)}} className="guild-settings-popup-item"onClick={handleReportAUser}>Report A Guild User</div>
              <div style={{background: getGuildSettingsItemsColors(clickedGuild.guildColor)}} className="guild-settings-popup-item" onClick={handleShowReportGuild}>Report Guild</div>
              <div style={{background: getGuildSettingsItemsColors(clickedGuild.guildColor)}} className="guild-settings-popup-item" onClick={() => {DemoteToMember(UserData.id || UserData._id)}}>Demote Self</div>
              <div style={{background: getGuildSettingsItemsColors(clickedGuild.guildColor)}} className="guild-settings-popup-item" onClick={handleGiveWarning}>Give User a Warning</div>
            </div>
          )}
          {AllMembers && UserData.username === AllMembers.Owner.UserName && (
            <div className="guild-settings-popup">
              {/*make colors  */}
              <div onClick={handleGuildSettings} style={{alignSelf: 'flex-start', cursor: 'pointer'}}>Finish</div>
              <div style={{background: getGuildSettingsItemsColors(clickedGuild.guildColor)}} className="guild-settings-popup-item" onClick={handleGuildGuidelines}>Manage Guild guidelines</div>
              <div style={{background: getGuildSettingsItemsColors(clickedGuild.guildColor)}} className="guild-settings-popup-item" onClick={handleChangeFeatures}>Change Guild Features</div>
              <div style={{background: getGuildSettingsItemsColors(clickedGuild.guildColor)}} className="guild-settings-popup-item" onClick={handleSeeReportList}>See Report List</div>
              <div style={{background: getGuildSettingsItemsColors(clickedGuild.guildColor)}} className="guild-settings-popup-item" onClick={handleGiveWarning}>Give User a Warning</div>
              <div style={{background: getGuildSettingsItemsColors(clickedGuild.guildColor)}} className="guild-settings-popup-item" onClick={handleShowBanList}>Manage Banned Travelers</div>
              <div style={{background: getGuildSettingsItemsColors(clickedGuild.guildColor)}} className="guild-settings-popup-item" onClick={handleShowDisbandWarning}>Disband Guild</div>
              {ShowDisbandWarning && (
                <div className="guild-Report-A-User" style={{border: 'black solid 1px'}}>
                  <h3>Disbanding the guild removes all members/elders and the deletes the guild forever!</h3>
                  <div><span style={{paddingRight: '120px'}} onClick={DisbandGuild}>Confirm and Disband Guild</span>    <span onClick={() => {setShowDisbandWarning(false)}}>Cancel</span></div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {ShowGuildGuidelines && (
        <div style={{background: getGuildSettingsColors(clickedGuild.guildColor)}} className="guild-guidelines-popup-main">
          <h3 style={{margin: '0'}}>Guild Guidelines</h3>
          <p style={{textAlign: 'center', fontSize: '20px'}}>Guild Guidelines are unique to each guild to make the guild a welcoming and safe place.</p>
          {AllMembers && UserData.username !== AllMembers.Owner.UserName && (
            <div className="guild-Guideline-popup">
              {clickedGuild.guildGuidelines === "" && (
                <div>
                  Your guild leader has not yet set up guidelines for the Guild.
                  Please come back when he has to check the newest updated guidelines!
                </div>
              )}
              {clickedGuild.guildGuidelines !== "" && (
                <div>
                  {clickedGuild.guildGuidelines}
                </div>
              )}
              <h4 onClick={handleGuildGuidelines} >Acknowledge guidelines</h4>
            </div>
          )}
          {AllMembers && UserData.username === AllMembers.Owner.UserName && (
            <div className="guild-Guideline-popup">
              {clickedGuild.guildGuidelines === "" && (
                <div>
                  <p> As Guild Leader please make Guild Lines For your members to follow</p>
                  <textarea
                    style={{width: '95%', height: '195px', resize: 'none', fontSize: '20px', fontWeight: '600' }}
                    value={GuidelinesinputValue}
                    onChange={handleGuidelinesInputChange}
                  />
                  <h4 onClick={() => {ChangeGuidelines(GuidelinesinputValue)}}>Save and Exit?</h4>
                </div>
              )}
              {clickedGuild.guildGuidelines !== "" && (
                <div>
                  {!ShowGuildGuidelines2 && (
                    <div>
                      <p>These Are the Current Guidelines</p>
                      <br></br>
                      {clickedGuild.guildGuidelines}
                      <br/>
                      <br/>
                      <br/>
                      Whould you Like to change them??
                      <h4><span style={{paddingRight: '60%', cursor: 'pointer'}} onClick={handleGuildGuidelines2}>Yes</span>       <span style={{cursor: 'pointer'}}  onClick={handleGuildGuidelines}>No</span></h4>
                    </div>
                  )}
                  {ShowGuildGuidelines2 && (
                    <div>
                    <textarea
                      style={{width: '95%', height: '195px', resize: 'none', fontSize: '20px', fontWeight: '600' }}
                      value={GuidelinesinputValue}
                      onChange={handleGuidelinesInputChange}
                    />
                    <h4 onClick={() => {ChangeGuidelines(GuidelinesinputValue)}}>Save and Exit?</h4>
                  </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {ShowChangeGuildFeatures && (
        <div >
          {!ShowEditGuildFeatures && (
            <div style={{background: getGuildSettingsColors(clickedGuild.guildColor)}} className="guild-features-popup-main">
              <h3 style={{textAlign: 'center' ,margin: '0'}}>Guild Features</h3>
              <div>Guild Moto: {clickedGuild.guildMoto}</div>
              <div>Guild Bio:</div>
              <div style={{height: '200px', marginTop: '-24px', overflowY: 'auto', border: 'white groove 2px'}}>{clickedGuild.bio}</div>
              <div>{clickedGuild.RequestToJoin ? 'Request To Join' : 'Open For all'}</div>
              <div>Findable: {clickedGuild.Findable ? 'Findable' : 'Hidden'}</div>
              <div>Guild Color: {clickedGuild.guildColor}</div>
              <h3 className="guild-settings" onClick={handleEditFeatures}>Edit Features</h3>
              <h3 onClick={handleChangeFeatures} style={{position: 'absolute', bottom: '0', right: '10px', cursor: 'pointer' , margin: '0'}}>Finish</h3>
            </div>
          )}
          {ShowEditGuildFeatures && (
            <div style={{background: getGuildSettingsColors(clickedGuild.guildColor)}} className="guild-features-popup-main">
            <h2 style={{ textAlign: 'center' }}>Edit Guild Features</h2>
            <form onSubmit={handleSubmit}>
              <div className="guild-features-form-divs">
                <label>Guild Moto: </label>
                <input
                  maxLength={45}
                  type="text"
                  name="guildMoto"
                  value={guildData.guildMoto}
                  onChange={handleChange}
                />
              </div>
              <div className="guild-features-form-divs">
                <label>Guild bio: </label>
                <textarea
                  maxLength={165}
                  name="bio"
                  value={guildData.bio}
                  onChange={handleChange}
                  style={{resize: 'none', height: '60px', width: '60%'}}
                />
              </div>
              <div className="guild-features-form-divs">
                <label>
                  <input
                    type="checkbox"
                    name="RequestToJoin"
                    checked={guildData.RequestToJoin}
                    onChange={handleChange}
                  />
                   Request To Join
                </label>
              </div>
              <div className="guild-features-form-divs">
                <label>
                  <input
                    type="checkbox"
                    name="Findable"
                    checked={guildData.Findable}
                    onChange={handleChange}
                  />
                   Findable
                </label>
              </div>
              <div className="guild-features-form-divs">
                <label>Guild Color: </label>
                <select
                  name="guildColor"
                  value={guildData.guildColor}
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
              </div>
              <button className="guild-features-form-submit-btn" type="submit">Finish</button>
              <h2 onClick={handleEditFeatures} style={{ position: 'absolute', bottom: '0', left: '10px', cursor: 'pointer' }}>leave</h2>
            </form>
          </div>
          )}
        </div>
      )}
      {ShowGuildReportList && (
        <div style={{background: getGuildSettingsColors(clickedGuild.guildColor)}} className="guild-Report-A-User-popup-main">
          <h2 style={{ textAlign: 'center' }}>Report List</h2>
          <div style={{overflowY: 'auto', maxHeight: '65%',}}>
            {clickedGuild.Reports.map((report) => (
              <div className="report-list-divs">
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '20px,'}}>
                  <div>User: {report.TravelerUserName}</div>
                  <div style={{paddingRight: '15%'}}>Reason: {report.ReasonForReport}</div>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderTop: 'solid white 2px'}}>
                  <div onClick={() => {WarnMemberFromReport(report)}}>Issue A Warning</div>
                  <div onClick={() => {BanFromReportMember(report.TravelerId, report.ReasonForReport, report._id || report.id)}}>Ban User</div>
                  <div onClick={() => {RemoveReport(report._id || report.id)}}>Ignore Report</div>
                </div>
              </div>
            ))}
          </div>
            <h2 onClick={handleSeeReportList} style={{ position: 'absolute', bottom: '0', left: '10px', cursor: 'pointer' }}>leave</h2>
        </div>
      )}
      {ShowGuildReportUser && (
        <div style={{background: getGuildSettingsColors(clickedGuild.guildColor)}} className="guild-Report-A-User-popup-main">
          <h2>Report A Guild User</h2>
          <p>Who is the User you are reporting in the guild?</p>
          <div style={{overflowY: 'auto', maxHeight: '55%', border: 'white solid 3px', paddingLeft: '20px', paddingRight: '20px'}}>
            <h3>Elders</h3>
            <div className="Report-A-User-grid-container">
              {AllMembers.Elders
              .filter(elder => elder.UserName !== UserData.username)
              .map((elder) => (
                <div onClick={() => {ReportAUser(elder)}} className="Report-A-User-grid-item" key={elder.UserName}>
                  <div>{elder.UserName}</div>
                  <div>Elder</div>
                </div>
              ))}
            </div>
            <h3>Members</h3>
            <div className="Report-A-User-grid-container">
              {AllMembers.Members
              .filter(member => member.UserName !== UserData.username)
              .map((member) => (
                <div onClick={() => {ReportAUser(member)}} className="Report-A-User-grid-item" key={member.UserName}>
                  <div>{member.UserName}</div>
                  <div>Member</div>
                </div>
              ))}
            </div>
          </div>
          <h3 style={{ position: 'absolute', bottom: '0', left: '10px', cursor: 'pointer' }} onClick={handleReportAUser}>Finish</h3>
          {clickedMemberForReport && (
            <div className="guild-Report-A-User" style={{border: 'black solid 1px'}}>
              <h3>{clickedMemberForReport.UserName}</h3>
              <p>Reason For Report</p>
              <textarea
                maxLength={200}
                style={{width: '45%', height: '20%', resize: 'none', fontSize: '20px'}}
                type="text"
                value={ReportinputValue}
                onChange={handleReportInputChange}
              />
              <br/><br/><br/>
              <h2 onClick={() => {ReportMember(clickedMemberForReport.id || clickedMemberForReport._id, ReportinputValue )}} style={{cursor: 'pointer'}}>Submit Report</h2>
            </div>
          )}
        </div>
      )}
      {ShowGuildWarningUser && (
        <div style={{background: getGuildSettingsColors(clickedGuild.guildColor)}} className="guild-Report-A-User-popup-main">
          <h2>Give User A Warning</h2>
          <p>Who are you giving a warning?</p>
          <div style={{overflowY: 'auto', maxHeight: '55%', border: 'white solid 3px', paddingLeft: '20px', paddingRight: '20px'}}>
            <h3>Elders</h3>
            <div className="Report-A-User-grid-container">
              {AllMembers.Elders
              .filter(elder => elder.UserName !== UserData.username)
              .map((elder) => (
                <div style={{background: getGuildSettingsItemsColors(clickedGuild.guildColor)}} onClick={() => {WarnAUser(elder)}} className="Report-A-User-grid-item" key={elder.UserName}>
                  <div style={{fontWeight: '500', fontSize: '30px'}}>{elder.UserName}</div>
                  <div style={{fontSize: '28px'}}>Elder</div>
                  <div># of Warnings: {clickedGuild.Warnings.filter(warning => warning.TravelerUserName === elder.UserName).length}</div>
                </div>
              ))}
            </div>
            <h3>Members</h3>
            <div className="Report-A-User-grid-container">
              {AllMembers.Members
              .filter(member => member.UserName !== UserData.username)
              .map((member) => (
                <div onClick={() => {WarnAUser(member)}} className="Report-A-User-grid-item" key={member.UserName}>
                  <div>{member.UserName}</div>
                  <div>Member</div>
                  <div># of Warnings: {clickedGuild.Warnings.filter(warning => warning.TravelerUserName === member.UserName).length}</div>
                </div>
              ))}
            </div>
          </div>
          <h3 style={{ position: 'absolute', bottom: '0', left: '10px', cursor: 'pointer' }} onClick={handleGiveWarning}>Finish</h3>
          {clickedMemberForWarning && (
            <div className="guild-Report-A-User" style={{border: 'black solid 1px'}}>
              <h3>{clickedMemberForWarning.UserName || clickedMemberForWarning.TravelerUserName}</h3>
              <p onClick={() => {console.log(clickedMemberForWarning)}}>Reason For Warning</p>
              <textarea
                maxLength={200}
                style={{width: '45%', height: '20%', resize: 'none', fontSize: '20px'}}
                type="text"
                value={WarninginputValue}
                onChange={handleWarningInputChange}
              />
              <br/><br/><br/>
              <h2 onClick={() => {WarnMember(clickedMemberForWarning.TravelerId || clickedMemberForWarning.id || clickedMemberForWarning._id , WarninginputValue, clickedMemberForWarning._id)}} style={{cursor: 'pointer'}}>Submit Warning</h2>
            </div>
          )}
        </div>
      )}
      {ShowWarnings && (
        <div style={{background: getGuildSettingsColors(clickedGuild.guildColor)}} className="guild-Report-A-User-popup-main">
          <h2 style={{ textAlign: 'center' }}>Warnings</h2>
          {clickedGuild.Warnings.filter(warning => warning.TravelerUserName === UserData.username).length === 0 ? (
            <h2 style={{textAlign: 'center'}}>You currently have no warnings, keep up the good attitude!</h2>
          ) : (
            <div style={{overflowY: 'auto', height: '70%'}}>
              {clickedGuild.Warnings.filter(warning => warning.TravelerUserName === UserData.username).map((warning, index) => (
                <div key={index} className="warning-item">
                  <p><strong>{index + 1}{index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} Warning </strong> </p>
                  <p> Reason: {warning.ReasonForWarning}</p>
                </div>
              ))}
            </div>
          )}
          <h3 style={{ position: 'absolute', bottom: '0', left: '10px', cursor: 'pointer' }} onClick={handleShowWarnings}>Finish</h3>
        </div>
      )}
      {ShowBannedTravelers && (
        <div style={{background: getGuildSettingsColors(clickedGuild.guildColor)}} className="guild-Report-A-User-popup-main">
          {clickedGuild.bannedTravelers.length === 0 && (
            <div>
              There are no banned travelers.
            </div>
          )}
          {clickedGuild.bannedTravelers.length !== 0 && (
            <div>
               {clickedGuild.bannedTravelers.map(traveler => (
                <div  className="warning-item">
                  <div>
                    <p>{traveler.TravelerUserName} <strong>Banned</strong> </p>
                    <p> Reason: {traveler.Reason}</p>
                  </div>
                  <div>
                    <p onClick={() => (UnbanMember(traveler.TravelerId))}>Unban</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <h3 style={{ position: 'absolute', bottom: '0', left: '10px', cursor: 'pointer' }} onClick={handleShowBanList}>Finish</h3>
        </div>
      )}
      {ShowReportGuild && (
        <div style={{background: getGuildSettingsColors(clickedGuild.guildColor)}} className="guild-Report-A-User-popup-main">
          <h2 style={{marginBottom: '100px', textAlign: 'center'}}>Reporting  Guild</h2>
          <form style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10%', height: '65%'}} onSubmit={handleReportSubmit}>
            <input style={{padding: '10px',  width: '30%', fontSize:'20px',}} type="text" name="GuildName" value={reportData.GuildName} onChange={handleReportChange} placeholder="Reporting Guild's Name" required />
            <select
              name="ReasonForReport"
              value={reportData.ReasonForReport}
              onChange={handleReportChange}
              style={{padding: '10px',  width: '30%', fontSize:'20px',}}
            >
              <option value="Harassment">Harassment</option>
              <option value="Sexual Misconduct">Sexual Misconduct</option>
              <option value="Racial Misconduct">Racial Misconduct</option>
              <option value="Discriminatory">Discriminatory</option>
              <option value="Threats">Threats</option>
              <option value="Other">Other</option>
            </select>
            <textarea style={{resize: 'none', width: '50%', height: '30%', fontSize: '20px'}} name="ReportDetails" value={reportData.ReportDetails} onChange={handleReportChange} placeholder="Report Details" required></textarea>
            <button type="submit">Submit Report</button>
          </form>
          <h3 style={{ position: 'absolute', bottom: '0', left: '10px', cursor: 'pointer' }} onClick={handleShowReportGuild}>Cancel</h3>
        </div>
      )}
      {ShowElderMessages && (
        <div style={{background: getGuildSettingsColors(clickedGuild.guildColor)}} className="guild-Elder-Messages-popup-main">
          {AllMembers && AllMembers.Elders.some(elder => elder.UserName === UserData.username) && (<div style={{width: '80%'}}>Sending Messages To Owner</div>)}
          {AllMembers && AllMembers.Elders.some(elder => elder.UserName === UserData.username) && (
            <div className="message-container">
              <div className="messages-alignment-div">
                {clickedGuild.guildElderMessages
                  .filter(convo => convo.ElderConvoStarter === UserData.username)
                  .map((convo, index) => {
                    // Merge and sort messages by timestamp
                    const combinedMessages = [
                      ...convo.EldersMessages.map(message => ({ ...message, type: 'elder' })),
                      ...convo.OwnersMessages.map(message => ({ ...message, type: 'owner' }))
                    ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                    return (
                      <div key={index}>
                        {combinedMessages.map((message, idx) => (
                          <div key={idx} className={message.type === 'elder' ? 'guild-message-right' : 'guild-message-left'}>
                            <p style={{ margin: 0, backgroundColor: getGuildSettingsItemsColors(clickedGuild.guildColor) }} className={message.type === 'elder' ? 'guild-message-content-elder' : 'guild-message-content-owner'}>
                              {message.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    );
                  })}
              </div>
              <div className="input-div">
                <input 
                  className="messages-input"
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                />
                <button style={{backgroundColor: getGuildSettingsItemsColors(clickedGuild.guildColor) }} onClick={SendMessageToOwner} className="send-btn">Send Message</button>
              </div>
            </div>
          )}
          {AllMembers && UserData.username === AllMembers.Owner.UserName && (
            <div style={{display: "flex", flexDirection: 'Row', width: '100%', height: '100%'}}>
              <div style={{display: 'flex', width: '25%', flexDirection: 'column'}} className="Elder-messages-left">
                {clickedGuild.guildElderMessages.map((Convo, index) => (
                  <div key={index} onClick={() => {setcurrentlyclickedelder(Convo.ElderConvoStarter)}}>
                    {Convo.ElderConvoStarter}
                  </div>
                ))}
              </div>
              {currentlyclickedelder && (
                <div className="owner-message-container">
                  <div className="messages-alignment-div">
                    {clickedGuild.guildElderMessages
                      .filter(convo => convo.ElderConvoStarter === currentlyclickedelder)
                      .map((convo, index) => {
                        // Merge and sort messages by timestamp
                        const combinedMessages = [
                          ...convo.EldersMessages.map(message => ({ ...message, type: 'elder' })),
                          ...convo.OwnersMessages.map(message => ({ ...message, type: 'owner' }))
                        ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                        return (
                          <div key={index}>
                            {combinedMessages.map((message, idx) => (
                              <div key={idx} className={message.type === 'elder' ? 'guild-message-left' : 'guild-message-right'}>
                                <p style={{ margin: 0, backgroundColor: getGuildSettingsItemsColors(clickedGuild.guildColor) }} className={message.type === 'elder' ? 'guild-message-content-owner' : 'guild-message-content-elder'}>
                                  {message.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                  </div>
                  <div className="input-div">
                    <input 
                      className="messages-input"
                      value={messageInput}
                      onChange={e => setMessageInput(e.target.value)}
                    />
                    <button style={{ backgroundColor: getGuildSettingsItemsColors(clickedGuild.guildColor) }} onClick={SendMessageToElder} className="send-btn">Send Message</button>
                  </div>
                </div>
              )}
            </div>
          )}
          <h3 style={{ position: 'absolute', top: '-20px', right: '30px', cursor: 'pointer' }} onClick={() => {handleShowElderMessages(); setcurrentlyclickedelder(null)}}>Exit</h3>
        </div>
      )}
    </div>
  );
};

export default GuildPages;