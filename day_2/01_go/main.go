package main

import (
	"fmt"
	"io/ioutil"
	"math"
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
		min := math.MaxInt64
		max := math.MinInt64

		for _, cell := range row {
			val, _ := strconv.Atoi(cell)
			if val > max {
				max = val
			}
			if val < min {
				min = val
			}
		}

		sum += max - min
	}

	fmt.Printf("Checksum: %d\n", sum)
}
