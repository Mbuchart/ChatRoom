import React from "react";
import styled from "styled-components";

const rooms = [
    "general",
    "random",
    "jokes",
    "javascript"
];

const Container = styled.div`
    height: 100vh;
    width: 100%;
    display: flex;
`;

const SideBar = styled.div`
    height: 100%;
    width: 15%;
    border-right: 1px solid black;
`;

const ChatPanel = styled.div`
    height: 100;
    width: 85%;
    display: flex;
    flex-direction: column;
`;

const BodyContainer = styled.div`
    width: 100%;
    height: 75%;
    overflow: scroll;
    border-bottom: 1px solid black;
`;

const TextBox = styled.textarea`
    height: 15%;
    width: 100%;
`;

const ChannelInfo = styled.div`
    height: 10%;
    width: 100%;
    border-bottom: 1px solid black;
`;

const Row = styled.div`
    cursor: pointer;
`;

const Messages = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

function Chat(props) {
    function renderRooms(room) {
        const currentChat = {
            chatName: room,
            isChannel: true,
            receiverId: "",
            isUser: false,
            isBlocked: props.currentChat.isBlocked,
        }
        return (
            <Row onClick={() => props.toggleChat(currentChat)} key={room}>
                {room}
            </Row>
        );
    } 

    function renderUser(user) {
        if (user.id === props.yourId) {
            return (
                <Row key={user.id}>
                    You: {user.username}
                </Row>
            );
        }
        const currentChat = {
            chatName: user.username,
            isChannel: false,
            receiverId: user.id,
            isUser: true,
            isBlocked: props.currentChat.isBlocked,
        }
        return (
            <Row onClick={() => {
                props.toggleChat(currentChat);
            }} key={user.id}>
                {user.username}
            </Row>
        );
    };

    function renderMessages(message, index) {
        return (
            <div key={index}>
                <h3>{message.sender}</h3>
                <p>{message.content}</p>
            </div>
        );
    }

    let block;
    if (props.currentChat.isUser && !props.currentChat.isBlocked) {
        const currentChat = {
            chatName: props.currentChat.chatName,
            isChannel: props.currentChat.isChannel,
            receiverId: props.currentChat.receiverId,
            isUser: props.currentChat.isUser,
            isBlocked: true,
        }
        block = (    
            <ChannelInfo>
                {props.currentChat.chatName}
                <Row onClick={() => {
                props.toggleChat(currentChat);
                }}>block?</Row>
            </ChannelInfo>
        );
    } else if (!props.currentChat.isUser) {
        block = (    
            <ChannelInfo>
                {props.currentChat.chatName}
            </ChannelInfo>
        );
    } else {
        const currentChat = {
            chatName: props.currentChat.chatName,
            isChannel: props.currentChat.isChannel,
            receiverId: props.currentChat.receiverId,
            isUser: props.currentChat.isUser,
            isBlocked: false,
        }
        block = (    
            <ChannelInfo>
                {props.currentChat.chatName}
                <Row onClick={() => {
                props.toggleChat(currentChat);
                }}>unblock?</Row>
            </ChannelInfo>
        );
    }

    let body;
    if (!props.currentChat.isChannel || props.connectedRooms.includes(props.currentChat.chatName)) {
        body = (
            <Messages>
                {props.messages.map(renderMessages)}
            </Messages>
        );
    } else {
        body = (
            <button onClick={() => props.joinRoom(props.currentChat.chatName)} >Join {props.currentChat.chatName}</button>
        );
    }

    function handleKeyPress(e) {
        if (e.key === "Enter") {
            props.sendMessage();
        }
    }

    return (
        <Container>
            <SideBar>
                <h3>Channels</h3>
                {rooms.map(renderRooms)}
                <h3>All Users</h3>
                {props.allUsers.map(renderUser)}
            </SideBar>
            <ChatPanel>
                    {block}
                <BodyContainer>
                    {body}
                </BodyContainer>
                <TextBox
                    value={props.message}
                    onChange={props.handleMessageChange}
                    onKeyPress={handleKeyPress}
                    placeholder="say something I'm giving up on you...."
                />
            </ChatPanel>
        </Container>
    );
};

export default Chat;