# Skill Verification System

SkillVerify is a platform designed to validate and showcase individuals' skills through a peer verification system.
Users can post their skills along with evidence of their proficiency, and peers can verify and rate these skills.
Higher verifications contribute to a user's credibility and are reflected in their profile.
Additionally, users can mint NFTs to represent their skills.

This system can also be used to connect with others to work on projects, find mentors, or learn new skills.

## Workflow:

1. **Skill Addition:** Users add skills to their profiles along with self-assessed proficiency levels.
2. **Verification Process:** Peers review the skills posted by others and provide verification and ratings based on the evidence provided.
3. **Profile Update:** Verified skills and ratings are displayed on the user's profile, enhancing their professional image.
4. **NFT Minting:** Users can choose to mint NFTs representing their skills. These NFTs can be kept as digital assets or shared with potential employers or clients.
5. **Networking:** Users can connect with others based on their skills and ratings, enabling collaboration and knowledge sharing.

## Benefits:

- **Credibility:** Peer verification adds credibility to the skills listed on a user's profile.
- **Transparency:** Evidence submission ensures transparency in skill assessment.
- **Professional Development:** Users can track their skill progression and achievements over time.
- **Digital Ownership:** NFTs provide a unique and immutable record of skills and verifications.
- **Networking:** Engaging in the verification process fosters a supportive community of professionals sharing their expertise.

## Quickstart

To get started with Skill-verify, follow the steps below:

1. Clone this repo & install dependencies

```
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

4. On a third terminal, start your NextJS app:

```
yarn start
```

5. In your `.env.local` file in `packages/nextjs`

```
DATABASE_URL = "your mongodb url"
```

### Big thanks to : 🏗 Scaffold-ETH 2 and Team BuidlGuidl
