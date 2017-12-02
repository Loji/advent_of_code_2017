package main

import (
	"fmt"
	"io/ioutil"
	"strconv"
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
	input := getFileContent()
	sum := 0

	for _, row := range input {
		for cellIndex, cell := range row {
			val, _ := strconv.Atoi(cell)
			compareWith := row[:cellIndex]

			for _, dividableCell := range compareWith {
				dividable, _ := strconv.Atoi(dividableCell)
				var bigger int
				var smaller int

				if dividable > val {
					bigger = dividable
					smaller = val
				} else {
					bigger = val
					smaller = dividable
				}

				if bigger%smaller == 0 && bigger != smaller {
					sum += bigger / smaller
				}
			}
		}
	}

	fmt.Printf("Checksum: %d\n", sum)
}
