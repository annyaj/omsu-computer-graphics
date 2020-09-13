package ru.omsu.graphics;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Random;

public class FernLeaf {
    private static float minX = -6;
    private static float maxX = 6;
    private static float minY = 0.1f;
    private static float maxY = 10;
    private static int pointNumber = 200000;
    private static float probability[] = new float[]{0.01f, 0.07f, 0.07f, 0.85f};
    private static int colors[] = new int[]{-1164660, -8575283, -32988, -983041};
    private static float funcCoefs[][] = new float[][]{
            {
                    0, 0, 0, 0.16f, 0, 0
            },
            {
                    -0.15f, 0.28f, 0.26f, 0.24f, 0, 0.44f
            },
            {
                    0.2f, -0.26f, 0.23f, 0.22f, 0, 1.6f
            },
            {
                    0.85f, 0.04f, -0.04f, 0.85f, 0, 1.6f
            }
    };

    private static int width;
    private static int height;
    private final static int COLOR_BLACK = -16777216;

    public static void drawLeaf() {
        BufferedImage bufferedImage = new BufferedImage(1000, 960, BufferedImage.TYPE_INT_RGB);
        width = (int) (bufferedImage.getWidth() / (maxX - minX));
        height = (int) (bufferedImage.getHeight() / (maxY - minY));
        Random random = new Random();
        float x = 0;
        float y = 0;
        float xTemp = 0, yTemp = 0;
        int functionNumber = 0;
        int color = COLOR_BLACK;

        for (int i = 1; i <= pointNumber; i++) {
            double probNumber = random.nextDouble();
            for (int j = 0; j <= 3; j++) {
                probNumber -= probability[j];
                if (probNumber <= 0) {
                    functionNumber = j;
                    break;
                }
            }

            xTemp = funcCoefs[functionNumber][0] * x + funcCoefs[functionNumber][1] * y + funcCoefs[functionNumber][4];
            yTemp = funcCoefs[functionNumber][2] * x + funcCoefs[functionNumber][3] * y + funcCoefs[functionNumber][5];

            x = xTemp;
            y = yTemp;

            xTemp = (int) (x * width + bufferedImage.getWidth() / 2);
            yTemp = (int) (y * height) * (-1) + bufferedImage.getHeight();

            bufferedImage.setRGB((int) xTemp, (int) yTemp,  functionNumber == 3 ? color : colors[functionNumber]);
            color = bufferedImage.getRGB((int) xTemp, (int) yTemp);
        }
        try {
            ImageIO.write(bufferedImage, "jpg", new File("leaf.jpg"));
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    public static void main(String[] args) {
        System.out.println(new Color(238, 58, 140).getRGB());
        System.out.println(new Color(125, 38, 205).getRGB());
        System.out.println(new Color(255, 127, 36).getRGB());
        System.out.println(new Color(240, 255, 255).getRGB());
        drawLeaf();
    }
}
