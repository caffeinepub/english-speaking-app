import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Session and Prompt Types, and Comparison modules
  public type SessionStatus = {
    #inProgress;
    #completed;
    #submittedForReview;
    #reviewed;
  };

  public type SpeakingPrompt = {
    id : Nat;
    title : Text;
    description : Text;
    difficultyLevel : Nat; // 1 (Beginner) to 5 (Advanced)
  };

  module SpeakingPrompt {
    public func compare(prompt1 : SpeakingPrompt, prompt2 : SpeakingPrompt) : Order.Order {
      Nat.compare(prompt1.difficultyLevel, prompt2.difficultyLevel);
    };
  };

  public type SpeakingSession = {
    sessionId : Nat;
    prompt : SpeakingPrompt;
    studentId : Principal;
    startTime : Time.Time;
    endTime : ?Time.Time;
    status : SessionStatus;
    recordingUrl : ?Text;
    feedback : ?Text;
  };

  module SpeakingSession {
    public func compare(session1 : SpeakingSession, session2 : SpeakingSession) : Order.Order {
      switch (session1.endTime, session2.endTime) {
        case (?endTime1, ?endTime2) {
          Int.compare(endTime1, endTime2);
        };
        case (?_, null) { #greater };
        case (null, ?_) { #less };
        case (null, null) { Int.compare(session1.startTime, session2.startTime) };
      };
    };
  };

  public type UserProfile = {
    name : Text;
    role : Text; // "student" or "teacher"
  };

  // Authorization setup
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // State Management
  let sessions = Map.empty<Nat, SpeakingSession>();
  let prompts = Map.empty<Nat, SpeakingPrompt>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextSessionId = 1;
  var nextPromptId = 1;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Prompt Management
  public shared ({ caller }) func createPrompt(title : Text, description : Text, difficultyLevel : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create prompts");
    };

    let prompt : SpeakingPrompt = {
      id = nextPromptId;
      title;
      description;
      difficultyLevel;
    };
    prompts.add(nextPromptId, prompt);
    nextPromptId += 1;
    prompt.id;
  };

  public query ({ caller }) func getPrompt(promptId : Nat) : async ?SpeakingPrompt {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view prompts");
    };
    prompts.get(promptId);
  };

  public query ({ caller }) func getAllPrompts() : async [SpeakingPrompt] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view prompts");
    };
    prompts.values().toArray().sort();
  };

  // Session Management
  public shared ({ caller }) func startSession(promptId : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can start sessions");
    };

    switch (prompts.get(promptId)) {
      case (null) {
        Runtime.trap("Prompt not found");
      };
      case (?prompt) {
        let session : SpeakingSession = {
          sessionId = nextSessionId;
          prompt;
          studentId = caller;
          startTime = Time.now();
          endTime = null;
          status = #inProgress;
          recordingUrl = null;
          feedback = null;
        };
        sessions.add(nextSessionId, session);
        nextSessionId += 1;
        session.sessionId;
      };
    };
  };

  public shared ({ caller }) func completeSession(sessionId : Nat, recordingUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete sessions");
    };

    switch (sessions.get(sessionId)) {
      case (null) {
        Runtime.trap("Session not found");
      };
      case (?session) {
        if (caller != session.studentId) {
          Runtime.trap("Unauthorized: Only the session owner can complete this session");
        };
        let updatedSession = {
          session with
          endTime = ?Time.now();
          status = #submittedForReview;
          recordingUrl = ?recordingUrl;
        };
        sessions.add(sessionId, updatedSession);
      };
    };
  };

  // Instructor Review (Admin Only)
  public shared ({ caller }) func reviewSession(sessionId : Nat, feedback : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can review sessions");
    };

    switch (sessions.get(sessionId)) {
      case (null) {
        Runtime.trap("Session not found");
      };
      case (?session) {
        if (session.status != #submittedForReview and session.status != #completed) {
          Runtime.trap("Session must be completed before review");
        };
        let updatedSession = {
          session with
          status = #reviewed;
          feedback = ?feedback;
        };
        sessions.add(sessionId, updatedSession);
      };
    };
  };

  public query ({ caller }) func getSession(sessionId : Nat) : async SpeakingSession {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access session data");
    };

    switch (sessions.get(sessionId)) {
      case (null) {
        Runtime.trap("Session not found");
      };
      case (?session) {
        if (caller != session.studentId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own sessions");
        };
        session;
      };
    };
  };

  public query ({ caller }) func getUserSessions() : async [SpeakingSession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access session data");
    };

    sessions.values().toArray().filter(
      func(session) {
        session.studentId == caller;
      }
    );
  };

  public query ({ caller }) func getAllSessions() : async [SpeakingSession] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all sessions");
    };

    sessions.values().toArray().sort();
  };
};
