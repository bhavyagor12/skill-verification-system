//SPDX-License-Identifier: MIT.sol
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
		uint256 skillId;
		string name;
		uint8 selfRating;
		uint8 peerRating;
		address[] verifiers;
	}
	uint256 public _tokenId;
	mapping(address => Skill[]) public skills;
	mapping(address => string) public users;
	mapping(address => uint256) public addressToTokenId;

	constructor() ERC721("SkillVerification", "SKV") {}

	function addUser(string memory _name) public {
		users[msg.sender] = _name;
	}

	function addSkill(
		uint256 skillId,
		string memory _name,
		uint8 _selfRating
	) public {
		skills[msg.sender].push(
			Skill(skillId, _name, _selfRating, 0, new address[](0))
		);
	}

	function updateSkill(
		uint256 _skillId,
		string memory _name,
		uint8 _selfRating
	) public {
		Skill storage skill = skills[msg.sender][_skillId];
		skill.name = _name;
		skill.selfRating = _selfRating;
	}

	function deleteSkill(uint256 _skillId) public {
		require(_skillId < skills[msg.sender].length, "Index out of bounds");
		// Move the last element into the position to delete
		uint256 lastIndex = skills[msg.sender].length - 1;
		skills[msg.sender][_skillId] = skills[msg.sender][lastIndex];
		// Delete the last element (which is now a duplicate)
		delete skills[msg.sender][lastIndex];
		// Shorten the array
		skills[msg.sender].pop();
	}

	function updateUserName(string memory _name) public {
		users[msg.sender] = _name;
	}

	function tokenURI(
		uint256 tokenId
	) public view override(ERC721URIStorage, ERC721) returns (string memory) {
		return _buildTokenURI(tokenId);
	}

	function updateTokenURI() public {
		uint256 tokenId = addressToTokenId[msg.sender];
		tokenURI(tokenId);
	}

	function _createText(
		string memory _text,
		uint256 _x,
		uint256 _y,
		uint256 _fontSize
	) private pure returns (string memory) {
		return
			string(
				abi.encodePacked(
					'<text x="',
					toString(_x),
					'" y="',
					toString(_y),
					'" font-family="Verdana" font-size="',
					toString(_fontSize),
					'" fill="black">',
					_text,
					"</text>"
				)
			);
	}

	function _buildSkillSVG(
		Skill memory skill,
		uint256 textY
	) private pure returns (string memory) {
		string memory svg;
		uint256 totalRating = computeTotalRating(
			skill.selfRating,
			skill.peerRating
		);
		if (skill.verifiers.length == 0) {
			totalRating = skill.selfRating;
		}

		svg = string(
			abi.encodePacked(
				_createText(skill.name, 10, 62 + (textY * 50), 15),
				'<svg x="',
				toString(bytes(skill.name).length + 40),
				'" y="',
				toString(48 + (textY * 50)),
				'" width="250" height="50" xmlns="http://www.w3.org/2000/svg">',
				generateStarsSVG(totalRating),
				"</svg>",
				_createText(
					string(
						abi.encodePacked(
							"(",
							toString(skill.verifiers.length),
							")"
						)
					),
					bytes(skill.name).length + 185, // Adjust x-coordinate to position it after stars
					60 + (textY * 50),
					15
				)
			)
		);

		return svg;
	}

	function _combineSVGs(
		string memory _name,
		string[] memory skillSVGs
	) private pure returns (string memory) {
		string
			memory combinedSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">';
		combinedSVG = string(
			abi.encodePacked(
				combinedSVG,
				'<rect width="500" height="500" fill="white"/>',
				_createText(_name, 40, 40, 40)
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
		string memory name = users[owner];
		Skill[] memory userSkills = skills[owner];
		string[] memory skillSVGs = new string[](userSkills.length);
		for (uint256 index = 0; index < userSkills.length; index++) {
			skillSVGs[index] = _buildSkillSVG(userSkills[index], index);
		}

		string memory combinedSVG = _combineSVGs(name, skillSVGs);
		return _encodeMetadataJSON(tokenId, combinedSVG);
	}

	function mint() public {
		Skill[] memory userSkills = skills[msg.sender];
		require(userSkills.length > 0, "No skills found for this user");
		_tokenId++;
		_mint(msg.sender, _tokenId);
		addressToTokenId[msg.sender] = _tokenId;
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
						'" y="0" width="16" height="16" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">',
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
						'" y="0" width="16" height="16" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">',
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
			bytes(users[msg.sender]).length > 0,
			"You need to register a profile"
		);
		require(_user != msg.sender, "Cannot verify own skill");
		Skill storage skill = skills[_user][_skillId];
		require(
			_rating >= 1 && _rating <= 5,
			"Rating should be between 1 and 5"
		);
		skill.verifiers.push(msg.sender);
		skill.peerRating = uint8(
			(skill.peerRating + _rating) / skill.verifiers.length
		);
	}

	function computeTotalRating(
		uint8 _selfRating,
		uint8 _peerRating
	) public pure returns (uint8) {
		return uint8((_selfRating + _peerRating) / 2);
	}

	function getUserName(address user) public view returns (string memory) {
		return users[user];
	}

	function getTokenId(address user) public view returns (uint256) {
		return addressToTokenId[user];
	}
}
