import { formatNumberByLocale } from "@packages/format-number";
import { StyledLink } from "../../styledComponents/StyledLink";
import { StyledMainTitle, StyledSubTitle } from "../../styledComponents/StyledMainTitle";
import { Base10Simulation } from "../binary/Base10Simulation";

export const Bits = () => {
  return (
    <div>
      <StyledMainTitle>Bits</StyledMainTitle>
      <div>
        For computers everything is <StyledLink pathname="/binary">binary</StyledLink> data,
        revolving around 0s and 1s.
      </div>
      <div>
        Inside a computer there are electric wires and circuits hat carry all of the information.
      </div>
      <div>
        If there is a single wire with electricity flowing through it, it only has the capability of
        its signal being either on, or off.
      </div>
      <div>With one wire we can just represent a true (1) or false (0).</div>
      <div>
        This on/off state of a single wire is called a bit which is the smallest piece of
        information a computer can store.
      </div>
      <div>
        More wires lead to more bits. Wih more wires there are possibilities of more 1s and 0s and
        thus it is possible to represent more complex information.
      </div>
      <div>
        The 1s and 0s are represented in the binary number system, where we can represent any number
        with 1s and 0s.
      </div>
      <div>
        For instance, if we want to represent the presentation from number 0 to 15, with lightbulbs
        that represent the wires:
      </div>
      <Base10Simulation startFrom={0} to={15} />
      <div>With 8 wires its possible to store numbers between 0 to 255.</div>
      <div>With 32 wires its possible to go over four billion.</div>
      <StyledSubTitle>Other types of data:</StyledSubTitle>
      <div>
        Other than using binary to represent numbers, its possible to represent text, images and
        sound with numbers.
      </div>
      <div>
        For instance, all of the letters in the alphabet, its possible to assign a number to each
        letter.
      </div>
      <div>Because of that, A could for instance be represented as a 1, B as 2 and so on.</div>
      <div>
        Because of that, its possible to represent any word or paragraph as a sequence of numbers,
        and those numbers can be stored as on or off electrical signals.
      </div>
      <StyledSubTitle>Images:</StyledSubTitle>
      <div>
        Everything graphical seen on a screen is made out of pixels. Each pixel has a color, and
        each color can be represented with numbers.
      </div>
      <div>
        Since a typical image has millions of these pixels and a typical video shows even up to 30
        images per second, that means rendering those pixels involves a lot of data.
      </div>
      <StyledSubTitle>Sound:</StyledSubTitle>
      <div>Every sound is a series of vibrations in the ear.</div>
      <div>Vibrations can be represented graphically as a waveform.</div>
      <div>Any point on a waveform can be represented by a number.</div>
      <div>That way, any sound be can broken down to a series of numbers.</div>
      <div>For higher quality sound, it would require a 32-bit audio over 8-bit audio.</div>
      <div>More bits means a higher range of numbers.</div>
      <StyledSubTitle>Additional information:</StyledSubTitle>
      <div>
        In Javascript for example, 255 is the maximum rgb (written as #000000, or rgb(0, 0, 0))
        value. That's because, with three numbres (rrr, ggg, bbb) its possible to describe{" "}
        {formatNumberByLocale({ num: 16777216 })} different colors. The human eye can distinguish
        about 10 million colors, so being abel to use more numbers to describe colors would be a
        waste of memory. Using one less wirte would make 127 the maximum number, and so{" "}
        {formatNumberByLocale({ num: 2097152 })} colors which isn't enough.
      </div>
      <div>
        Computers process binary data with electircal pulses - 0 means no pulse and 1 means we do
        have a pulse. If we want more numbers added (so that a computer wouldn't necessarily work on
        binary but on another numeric base), we would have to use different magnitudes of pulses.
        The transistors can't detect pulses that well, only the presence of one. In order to make it
        easier to detect said magnitudes, we would have to increase the voltage, which would in
        return waste more energy. Because of that, computers stick to simplest number system they
        can - binary.
      </div>
      <StyledSubTitle>Physical storage:</StyledSubTitle>
      <div>
        Computers tend to store bits using electromechanical transistors which can map electrical
        signals to either an on or off state.
      </div>
      <StyledSubTitle>
        Same binary values representing different things based off context:
      </StyledSubTitle>
      <div>
        The sequence 1000011 could represent 67 in a calculator application while also representing
        the letter "C" in a text file, so how can a computer know if the sequence in a text file
        represent 67 or C?
      </div>
      <div>
        A computer doesn’t "know" by itself. The meaning of 1000011 depends entirely on how the data
        is interpreted, not on the bits themselves.
      </div>
      <div>
        Interpretation comes from an agreed-upon format. The meaning comes from metadata,
        conventions, or the program reading the file.
      </div>
      <div>If the file is declared or assumed to be ASCII / UTF-8 text the program displays C.</div>
      <div>
        If the program treats the file as binary numeric data the program reads it as the number 67.
      </div>
      <div>
        Text files rely on character encodings. Text files don’t store “letters”, they store numbers
        that map to characters via an encoding. The encoding is the contract between writer and
        reader.
      </div>
      <div>PNG spec says “this byte means color”.</div>
      <div>JSON spec says “this sequence means a number”.</div>
      <div>UTF-8 spec says “this byte sequence means a character”</div>
      <div>
        The computer doesn’t see C67 as “a letter and a number”. It sees three characters: 'C', '6',
        '7'. Only after that does software decide whether '6' and '7' should be treated as the
        number 67.
      </div>
      <div>
        This is why: "67" ≠ 67, "067" ≠ "67", "67px" is valid text but not a number, JSON needs
        quotes for strings and no quotes for numbers.
      </div>
    </div>
  );
};
