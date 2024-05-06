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
					toString(20 + (textY * 50)),
					'" font-family="Verdana" font-size="10" fill="black">',
					skill.name,
					"</text>",
					'<text x="10" y="',
					toString(40 + (textY * 50)),
					'" font-family="Verdana" font-size="10" fill="black">',
					"Total Rating: ",
					toString(
						computeTotalRating(
							skill.selfRating,
							computePeerRating(skill.peerRating)
						)
					),
					"</text>",
					'<svg x="',
					toString(bytes(skill.name).length + 20),
					'" y="',
					toString(20 + (textY * 50)),
					'" width="250" height="50" xmlns="http://www.w3.org/2000/svg">',
					generateStarsSVG(
						computeTotalRating(
							skill.selfRating,
							computePeerRating(skill.peerRating)
						)
					),
					"</svg>"
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
			skillSVGs[index] = _buildSkillSVG(skills[index], index);
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
	) private pure returns (string memory) {
		string memory stars = "";
		for (uint256 i = 0; i < 5; i++) {
			if (i < rating) {
				// For rated stars
				stars = string(
					abi.encodePacked(
						stars,
						'<svg x="',
						toString(30 + (i * 24)), // Calculate x-coordinate inline
						'" y="0" width="24" height="24" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">',
						'<polygon points="20,0 8,36 38,12 2,12 32,36" fill="blue"/>',
						"</svg>"
					)
				);
			} else {
				// For unrated stars
				stars = string(
					abi.encodePacked(
						stars,
						'<svg x="',
						toString(30 + (i * 24)), // Calculate x-coordinate inline
						'" y="0" width="24" height="24" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">',
						'<polygon points="20,0 8,36 38,12 2,12 32,36" fill="gray"/>',
						"</svg>"
					)
				);
			}
		}
		return stars;
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
