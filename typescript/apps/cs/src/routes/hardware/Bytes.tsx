import { StyledInteractiveTitle } from "../../styledComponents/StyledInteractiveTitle";
import { StyledSubTitle } from "../../styledComponents/StyledMainTitle";

export const Bytes = () => {
  return (
    <div>
      <StyledInteractiveTitle>Bytes</StyledInteractiveTitle>
      <div>A byte is a unit of digital information that consists of 8 bits.</div>
      <div>Here is a single byte of information: 11110110.</div>
      <div>Here are three bytes of information: 00001010 01010100 11011011</div>
      <StyledSubTitle>Why bytes?</StyledSubTitle>
      <div>
        Computers do process all data as bits, but they prefer to process bits in byte sized
        groupings. A byte is how much a computer likes to "byte" at once.
      </div>
      <div>A byte is the smallest addressable unit of memory in most modern computers.</div>
      <div>
        A computer with byte-addressable memory can not store an individual piece of data that is
        smaller than a byte.
      </div>
      <div>For instance, address 1 might have 11110000 data, address 2 00001010, etc.</div>
      <StyledSubTitle>What's in a byte?</StyledSubTitle>
      <div>
        A byte can represent different types of information depending on the context - number,
        letter, program instruction, part of an audio recording, pixel in an image, etc.
      </div>
    </div>
  );
};
