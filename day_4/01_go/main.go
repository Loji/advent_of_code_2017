package main

import (
	"fmt"
	"io/ioutil"
	"strings"
)

func getFileContent() [][]string {
	file, err := ioutil.ReadFile("../input")
	if err != nil {
		panic("Couldn't read the input file")
	}

	lines := strings.Split(string(file), "\n")
	var result [][]string

	for _, val := range lines {
		result = append(result, strings.Fields(val))
	}

	return result
}

func main() {
	passphrasesList := getFileContent()

	var passphraseWordCount map[int]int = make(map[int]int)

	for passphraseIndex, passphrase := range passphrasesList {
		var wordsCount map[string]int = make(map[string]int)

		for _, word := range passphrase {
			wordsCount[word]++
			if wordsCount[word] > passphraseWordCount[passphraseIndex] {
				passphraseWordCount[passphraseIndex] = wordsCount[word]
			}
		}
	}

	passphrasesGood := 0
	passphrasesBad := 0

	for _, score := range passphraseWordCount {
		if score > 1 {
			passphrasesBad++
		} else {
			passphrasesGood++
		}
	}

	fmt.Printf("passphrases good %d, passphrases bad %d", passphrasesGood, passphrasesBad)
}
