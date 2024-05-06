//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author bhavyagor.eth
 */
contract SkillVerification is ERC721, Ownable, ERC721URIStorage {
	struct Skill {
		uint256 id;
		string name;
		string[] proof_of_work;
		uint8 selfRating;
		uint8[] peerRating;
		address[] verifications;
	}

	mapping(address => Skill[]) public userSkills;
	mapping(address => uint256) public addressToTokenId;

	constructor() ERC721("SkillVerification", "SKV") {
		userSkills[0xe4eE79d1C87ed91685CcC5EFAb33814Cc00dB679].push(
			Skill(
				0,
				"Solidity",
				new string[](0),
				5,
				new uint8[](0),
				new address[](0)
			)
		);
		userSkills[0xe4eE79d1C87ed91685CcC5EFAb33814Cc00dB679].push(
			Skill(
				1,
				"JavaScript",
				new string[](0),
				4,
				new uint8[](0),
				new address[](0)
			)
		);
	}

	function addSkill(
		string memory _name,
		string[] memory _proof_of_work,
		uint8 _selfRating
	) public {
		uint256 id = userSkills[msg.sender].length;

		Skill memory skill = Skill(
			id,
			_name,
			_proof_of_work,
			_selfRating,
			new uint8[](0),
			new address[](0)
		);
		userSkills[msg.sender].push(skill);
	}

	function tokenURI(
		uint256 tokenId
	) public view override(ERC721URIStorage, ERC721) returns (string memory) {
		return _buildTokenURI(tokenId);
	}

	function _buildSkillSVG(
		Skill memory skill,
		uint256 textY
	) private pure returns (string memory) {
		return
			string(
				abi.encodePacked(
					'<text x="10" y="',
					toString(textY),
					'" font-family="Verdana" font-size="10" fill="black">',
					skill.name,
					"</text>",
					'<text x="10" y="',
					toString(textY + 20),
					'" font-family="Verdana" font-size="10" fill="black">',
					"Total Rating: ",
					toString(
						computeTotalRating(
							skill.selfRating,
							computePeerRating(skill.peerRating)
						)
					),
					"</text>",
					generateStarsSVG(
						computeTotalRating(
							skill.selfRating,
							computePeerRating(skill.peerRating)
						)
					)
				)
			);
	}

	function _combineSVGs(
		string[] memory skillSVGs
	) private pure returns (string memory) {
		string
			memory combinedSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">';
		combinedSVG = string(
			abi.encodePacked(
				combinedSVG,
				'<rect width="500" height="500" fill="#f0f0f0"/>'
			)
		);
		for (uint256 i = 0; i < skillSVGs.length; i++) {
			combinedSVG = string(abi.encodePacked(combinedSVG, skillSVGs[i]));
		}
		combinedSVG = string(abi.encodePacked(combinedSVG, "</svg>"));
		return combinedSVG;
	}

	function _encodeMetadataJSON(
		uint256 tokenId,
		string memory combinedSVG
	) private pure returns (string memory) {
		string memory json = Base64.encode(
			bytes(
				string(
					abi.encodePacked(
						'{"name": "Skill Verification NFT #',
						toString(tokenId),
						'", "description": "An NFT that represents the skills of an individual", "image": "data:image/svg+xml;base64,',
						Base64.encode(bytes(combinedSVG)),
						'"}'
					)
				)
			)
		);
		return string(abi.encodePacked("data:application/json;base64,", json));
	}

	function _buildTokenURI(
		uint256 tokenId
	) private view returns (string memory) {
		require(
			_ownerOf(tokenId) != address(0),
			"ERC721Metadata: URI query for nonexistent token"
		);
		address owner = _ownerOf(tokenId);
		Skill[] memory skills = userSkills[owner];
		string[] memory skillSVGs = new string[](skills.length);
		for (uint256 index = 0; index < skills.length; index++) {
			skillSVGs[index] = _buildSkillSVG(skills[index], 20 + index * 20);
		}

		string memory combinedSVG = _combineSVGs(skillSVGs);
		return _encodeMetadataJSON(tokenId, combinedSVG);
	}

	function mint() public {
		require(
			userSkills[msg.sender].length > 0,
			"No skills found for this user"
		);
		_mint(msg.sender, 1);
		addressToTokenId[msg.sender] = 1;
	}

	function supportsInterface(
		bytes4 interfaceId
	) public view override(ERC721, ERC721URIStorage) returns (bool) {}

	function _burn(
		uint256 tokenId
	) internal override(ERC721, ERC721URIStorage) {
		super._burn(tokenId);
	}

	function generateStarsSVG(
		uint256 rating
	) internal pure returns (string memory) {
		string memory starsSVG;

		for (uint256 i = 0; i < 5; i++) {
			if (i < rating) {
				// Filled star
				starsSVG = string(
					abi.encodePacked(
						starsSVG,
						'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ffd700">',
						'<path d="M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z"/></svg>'
					)
				);
			} else {
				// Empty star
				starsSVG = string(
					abi.encodePacked(
						starsSVG,
						'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ccc">',
						'<path d="M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z"/></svg>'
					)
				);
			}
		}

		return starsSVG;
	}

	function toString(uint256 value) internal pure returns (string memory) {
		if (value == 0) {
			return "0";
		}
		uint256 temp = value;
		uint256 digits;
		while (temp != 0) {
			digits++;
			temp /= 10;
		}
		bytes memory buffer = new bytes(digits);
		while (value != 0) {
			digits -= 1;
			buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
			value /= 10;
		}
		return string(buffer);
	}

	function verifySkill(
		address _user,
		uint256 _skillId,
		uint8 _rating
	) public {
		require(
			_rating >= 1 && _rating <= 5,
			"Rating should be between 1 and 5"
		);
		userSkills[_user][_skillId].peerRating.push(_rating);
		userSkills[_user][_skillId].verifications.push(msg.sender);
	}

	function computePeerRating(
		uint8[] memory _peerRating
	) public pure returns (uint8) {
		if (_peerRating.length == 0) {
			return 0; // Avoid division by zero
		}
		uint256 sum = 0;
		for (uint256 i = 0; i < _peerRating.length; i++) {
			sum += uint256(_peerRating[i]);
		}
		return uint8(sum / _peerRating.length);
	}

	function computeTotalRating(
		uint8 _selfRating,
		uint8 _peerRating
	) public pure returns (uint8) {
		return uint8((_selfRating + _peerRating) / 2);
	}

	function getUserSkills(address _user) public view returns (Skill[] memory) {
		return userSkills[_user];
	}

	function getSkill(uint256 _skillId) public view returns (Skill memory) {
		return userSkills[msg.sender][_skillId];
	}

	function getTokenId() public view returns (uint256) {
		return addressToTokenId[msg.sender];
	}
}
